/*
	This is a API_NKAIDH project file.
	Developer: sizeoftrickster <sizeoftrickster@gmail.com>
	
	See more here https://github.com/sizeoftrickster/API_NKAIDH
	
	Copyright (c) 2024 Andrey Gazizov <sizeoftrickster@gmail.com>. All rights reserved.
*/

import { CDatabaseInstance } from "../../database/database.class";
import { IDatabaseDays, IDatabaseGroups, IDatabaseInfo } from "../../database/database.interface";
import { CAutoTransportXlsxInstance, CRoadConstructionXlsxInstance } from "../../parser/parser.class";
import { IParseGroupRows } from "../../parser/parser.interface";
import { CServerInstance } from "../../server/server.class";
import { TDayString } from "../../types/parser";
import { UpdateXlsxTables } from "../../utils";
import { CTask } from "../task.class"; 

const directions = [CRoadConstructionXlsxInstance, CAutoTransportXlsxInstance];

export const TaskAutoUpdate = new CTask("*/1 * * * *", async function() {
    try {
		for (let value of directions) {
			await UpdateXlsxTables(directions);

			let Info: IDatabaseInfo | null = await CDatabaseInstance.PrepareSingle<IDatabaseInfo>(`SELECT Column, Row FROM Info WHERE Direction = '${value.direction}'`);
			if (Info && Info.Row && Info.Column) {
				// Rows
				let Days: IDatabaseDays[] | null = await CDatabaseInstance.Prepare<IDatabaseDays>(`SELECT Day FROM Days WHERE Direction = '${value.direction}'`);
				if (Days) {
					let days: TDayString[] = Days.map(function(item) { return item.Day });
					let parsedRows: IParseGroupRows[] = value.ParseGroupsRows(days, Info.Column);
					for (let row of parsedRows) {
						await CDatabaseInstance.Exec(`UPDATE Days SET RowStart = '${row.rowStart}', RowEnd = '${row.rowEnd}' WHERE Direction = '${value.direction}' AND Day = '${row.day}'`);
					}
				}
				// Columns
				let Groups: IDatabaseGroups[] | null = await CDatabaseInstance.Prepare<IDatabaseGroups>(`Select Number from Groups WHERE Direction = '${value.direction}'`);
				if (Groups) {
					let groups: number[] = Groups.map(function(item) { return item.Number });
					let parsedColumns = value.ParseGroupsColumns(groups, Info.Row);
					if (parsedColumns) {
						for (let column of parsedColumns) {
							await CDatabaseInstance.Exec(`UPDATE Groups SET ColumnStart = '${column.columnStart}', ColumnEnd = '${column.columnEnd}' WHERE Direction = '${value.direction}' AND Number = ${column.groupNumber}`);
						}
					}
				}
			}

		}
	} catch (error) {
		CServerInstance.GetLog().error(error);
	}
});