/*
	This is a API_NKAIDH project file.
	Developer: sizeoftrickster <sizeoftrickster@gmail.com>
	
	See more here https://github.com/sizeoftrickster/API_NKAIDH
	
	Copyright (c) 2024 Andrey Gazizov <sizeoftrickster@gmail.com>. All rights reserved.
*/

import XLSX from "xlsx";
import axios from "axios";
import { IParseGroupColumns, IParseGroupRows } from "./parser.interface";
import { CServerInstance } from "../server/server.class";
import { TDirection } from "../types/parser";

export class CParser
{
    /**
     * Объект рабочей книги excel.
     * @private
     */
    private workbook!: XLSX.WorkBook;
    /**
     * Объект рабочего листа рабочей книги excel.
     * @private
     */
    private worksheet!: XLSX.WorkSheet;
    /**
     * Название листа рабочего листа рабочей книги excel.
     * @private
     */
    private sheetname!: string;

    /**
     * Название направления.
     * @public
     */
    public direction: string;
    /**
     * Состояние обновления рабочей книги excel.
     * @public
     */
    public status: boolean = false;
    /**
     * Последнее время обновления рабочей книги excel.
     * @public
     */
    public lastUpdate: number = 0;
    
    constructor(direction: TDirection) {
        this.direction = direction;
    }

    public async InitializeXLSX(link: string): Promise<boolean> {
        try {
            this.status = false;
            let response = await axios.get(link, { responseType: "arraybuffer" });
            if (response.status != 200) {
                this.status = false;
                return false;
            }
            this.workbook = XLSX.read(response.data);
            this.sheetname = this.workbook.SheetNames[0];
            this.worksheet = this.workbook.Sheets[this.sheetname];
            this.lastUpdate = new Date().getTime();
            this.status = true;
            return true;
        } catch (error) {
            CServerInstance.GetLog().error(error);
            this.status = false;
            return false;
        }
    }

    /**
     * Выполняет анализ единственной входящей горизонтальной линии ячеек таблицы.
     * Для корректности выходящих данных, используется проверка с входящим массивом номеров групп.
     * 
     * @param groups Входящие номера групп, с которыми происходит проверка после анализа. Например: [13, 14, 15, 111, 112, 113]
     * @param row Входящая горизонтальная линия ячейки, с которой происходит анализ.
     * @returns Возвращает массив: номер группы, начало и конец вертикальных ячеек.
     */
    public ParseGroupsColumns(groups: number[], row: number): IParseGroupColumns[] | null {
        // Потому-что горизонтальные ячейки начинают свой отсчет с 1, а не с 0.
        --row;
        // Массив, который будет возвращен после выполнения функции.
        let out: IParseGroupColumns[] = [];
        // Поскольку ячейки с номерами групп объеденены, анализ будет происходит только объединенных ячеек. Данная переменная хранит объект в массиве.
        let worksheetMerges: XLSX.Range[] | undefined = this.worksheet["!merges"];
        // Проверям на существование массива с объединенными ячейками.
        if (!worksheetMerges) {
            return null;
        }
        // Обрабатываем массив, который хранит в себе объекты, в данном случае объединенные ячейки.
        // Пример вывода worksheetMerges: [ { s: { c: num, r: num }, e: { c: num, r: num } } ]
        worksheetMerges.map((merge: XLSX.Range) => {
            // s(starting cell) - начало ячейки, e(ending cell) - конец ячейки, r(row number) - ряд, c(column number) - ячейка
            // Проверяем, чтобы горизонтальные ячейки имели горизонтальные ячейки позиции входящего аргумента row(номер вертикальной ячейки).
            // Пример вывода merge: { s: { c: num, r: num }, e: { c: num, r: num } }
            if (merge.s.r == row && merge.e.r == row) {
                // Переводим параметры объединенных ячеек в читабельный формат.
                // Пример вывода encode_range: AL11:AM11
                // Пример вывода encode_range со split(':'): [ 'AQ11', 'AR11' ]
                let parsedMerge = XLSX.utils.encode_range(merge).split(':');
                // Поскольку данные в объединенных ячеек находятся только в первой ячейке, поэтому читаем первую.
                // Все группы имеют свое число, которое не может повториться.
                // Поскольку некоторые группы имеют строковые значение, используется метод replace, чтобы убрать строковые значения.
                // Пример вывода GetDataFromCells: 13
                let parsedGroup: number = Number(this.GetDataFromCells(parsedMerge[0]).replace(/\D+/, ''));
                for (let group of groups) {
                    if (group == parsedGroup) {
                        // Начало и конец вертикальных ячеек имеют строковой формат, поэтому используется метод replace, чтобы убрать числовые значения.
                        let columnStart = String(parsedMerge[0].replace(/\d+/, ''));
                        let columnEnd = String(parsedMerge[1].replace(/\d+/, ''));
                        out.push({
                            groupNumber: group, columnStart: columnStart, columnEnd: columnEnd
                        });
                    }
                }

            }
        });
        return out;
    }

    public ParseGroupsRows(days: string[], column: string) {
        let out: IParseGroupRows[] = [];
        this.worksheet["!merges"]?.map((merge) => {
            let converted = column.charCodeAt(0) - 0x41;
            if (merge.s.c == converted && merge.e.c == converted) {
                let rowStart = merge.s.r + 1;
                days.forEach((dayInput: string) => {
                    let dayTable: string = this.worksheet[`${column}${rowStart}`].v;
                    if (dayTable.search(new RegExp(String.raw`${dayInput}`)) != -1) {
                        let rowEnd = merge.e.r + 1;
                        out.push({day: dayInput, rowStart: rowStart, rowEnd: rowEnd});
                    }
                });
            }
        });
        return out;
    }

    public GetDataFromCells(range: string, header: number = 1) {
        return XLSX.utils.sheet_to_json(
            this.worksheet, { range: range, header: header }
        ).join("");
    }

    public GetSchedule(RowStart: number, RowEnd: number, ColumnStart: string, ColumnEnd: string, DayIndex: number) {
        let RowIndex = (DayIndex == 1) ? RowStart - 1 : RowStart;

        let out: string[] = [];
        
        for (let index = RowIndex; index < RowEnd; index++) {
            // Номер пары
            let lessonNumber = this.GetDataFromCells(`B${index}`, 1);
            // Время пар
            let time = this.GetDataFromCells(`D${index}`, 1).trim();
            // Наименование пары
            let parsedLesson = this.GetDataFromCells(`${ColumnStart}${index}`, 1);
            // Кабинет
            let cabinet = this.GetDataFromCells(`${ColumnEnd}${index}`, 1);
            // Преподаватель
            let teacher = this.GetDataFromCells(`${ColumnStart}${index + 1}`);

            if (time) {
                if (parsedLesson) {
                    if (cabinet == "с/р" || cabinet == "ср") {
                        if (teacher) {
                            out.push(`Самостоятельная работа ▸ [<s>${time}</s>] ◂ ${parsedLesson} ▸ [${teacher}]`);
                        } else {
                            out.push(`Самостоятельная работа ▸ [<s>${time}</s>] ◂ ${parsedLesson}`);
                        }
                        //out.push(`Самостоятельная работа «${parsedLesson}», преподаватель: ${teacher}`);
                    } else if (cabinet) {
                        if (teacher) {
                            out.push(`<b>№${lessonNumber}</b> ▸ [<b>${time}</b>] ◂ <b>${parsedLesson}</b> ▸ [<b>${cabinet}</b>] ▸ [<b>${teacher}</b>]`);
                        } else {
                            out.push(`<b>№${lessonNumber}</b> ▸ [<b>${time}</b>] ◂ <b>${parsedLesson}</b> ▸ [<b>${cabinet}</b>]`);
                        }
                        //out.push(`№ ${lessonNumber} «${parsedLesson}», время: ${time}, преподаватель: ${teacher} [${cabinet}]`);
                    } else {
                        if (teacher) {
                            out.push(`[${ time }] ▸ [${teacher}]`);
                        } else {
                            teacher = this.GetDataFromCells(`${ColumnStart}${index}`);
                            out.push(`[${ time }] ▸ [${teacher}]`);    
                        }
                        // out.push(`Время: ${time}, преподаватель: ${parsedLesson}`)
                    }
                } else {
                    out.push(`<i>${time}</i>`)
                }
            }
        }
        
        // День недели
        let dayWeek = this.GetDataFromCells(`A${RowStart}`).trimEnd();
        out.unshift(`<b>${dayWeek}</b>`)
        
        return out;
    }
}; // export class CParser

export const CRoadConstructionXlsxInstance = new CParser("RC");
export const CAutoTransportXlsxInstance = new CParser("AT");