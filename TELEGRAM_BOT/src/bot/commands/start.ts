/*
	This is a NKAIDH_BOT_TELEGRAM project file.
	Developer: sizeoftrickster <sizeoftrickster@gmail.com>
	
	See more here https://github.com/sizeoftrickster/NKAIDH_BOT_TELEGRAM
	
	Copyright (c) 2025 Andrey Gazizov <sizeoftrickster@gmail.com>. All rights reserved.
*/

import { Context, Markup } from "telegraf";
import { CDatabaseInstance } from "../../database/database.class";
import { IUsers } from "../../database/database.interface";
import { GetNameFromContext } from "../bot.utils";
import { InlDirectionAT, InlDirectionRC, InlGetCallSchedule, InlGetSchedule, InlSelectDay } from "../bot.constants";

export async function CommandStart(context: Context) {
    try {
        let userId: number | undefined = context?.message?.from?.id;
        if (userId) {
            let Users: IUsers | null = CDatabaseInstance.PrepareSingle<IUsers>(`SELECT * FROM Users WHERE Id = ${userId}`);
            if (!Users) {
                CDatabaseInstance.Exec(`INSERT INTO Users (Id) VALUES(${userId})`);
            }
            Users = CDatabaseInstance.PrepareSingle<IUsers>(`SELECT * FROM Users WHERE Id = ${userId}`);
            if (Users && Users.Id) {
                let buttons: any[] = new Array();
                if (Users.PinnedRCGroups) {
                    let pinnedGroups: string[] = Users.PinnedRCGroups.split(",");
                    pinnedGroups.forEach((value) => {
                        buttons.push([
                            Markup.button.callback(`📌 Расписание группы №${value} 🚜`, `_${InlSelectDay}_${userId}_${InlDirectionRC}_${value}_`)
                        ]);
                    });
                }
                if (Users.PinnedATGroups) {
                    let pinnedGroups: string[] = Users.PinnedATGroups.split(",");
                    pinnedGroups.forEach((value) => {
                        buttons.push([
                            Markup.button.callback(`📌 Расписание группы №${value} 🚙`, `_${InlSelectDay}_${userId}_${InlDirectionAT}_${value}_`)
                        ]);
                    });
                }
                buttons.push(
                    [Markup.button.callback("📚 Расписание", `_${InlGetSchedule}_${userId}_`), Markup.button.callback("🕘 Звонки", `_${InlGetCallSchedule}_${userId}_`)],
                    [Markup.button.url("🎖 Официальный канал НКАиДХ", "https://t.me/+WEgBIr05REs3Zjcy")],
                    [Markup.button.url("🤩 Канал разработчика", "https://t.me/+Vs7SIWAHLzs2ZGUy")]
                );
                let userName: string = GetNameFromContext(context);
                await context.reply(`👋🏻 <b>Приветствую, ${userName}</b>!\n` +
                                    `👾 Бот позволяет получить <b>расписание колледжа НКАиДХ</b>.\n` +
                                    `🤟🏻 Для взаимодействия используйте <b>кнопки под сообщением</b>.\n` +
                                    `🤫 <b>Поддерживаемые направления</b>: <u>дорожно-строительное</u>, <u>авто-транспортное</u>`, {
                                        parse_mode: "HTML",
                                        reply_markup: Markup.inlineKeyboard(buttons).reply_markup
                                    });
            }
        }
    } catch (error) {
        console.log(error)
    }
}