/*
	This is a NKAIDH_BOT_TELEGRAM project file.
	Developer: sizeoftrickster <sizeoftrickster@gmail.com>
	
	See more here https://github.com/sizeoftrickster/NKAIDH_BOT_TELEGRAM
	
	Copyright (c) 2025 Andrey Gazizov <sizeoftrickster@gmail.com>. All rights reserved.
*/

import axios from "axios";
import { InlSelectDay, InlSendSchedule, SendScheduleActionsRegExp } from "../bot.constants";
import { CheckInputArgs, GetEmojiFromDirection, GetNameFromContext, GetNameFromDirection, GetSchedule } from "../bot.utils";
import { Markup } from "telegraf";

export async function SendScheduleActions(context: any) {
    try {
        let callbackQuery: string = context?.update?.callback_query?.data;
        if (callbackQuery && callbackQuery.search(SendScheduleActionsRegExp) != -1) {
            let matchedArgs: RegExpMatchArray | null = callbackQuery.match(SendScheduleActionsRegExp);
            if (matchedArgs) {
                let userId: number = context?.update.callback_query?.from?.id;
                let matchedUserId: number = Number(matchedArgs[1]);
                let matchedDirection: string = matchedArgs[2];
                
                await CheckInputArgs(context, userId, matchedUserId, matchedDirection);

                let matchedGroup: string = matchedArgs[3];
                let matchedDay: string = matchedArgs[4];
                
                let schedule = await GetSchedule(matchedDirection, matchedGroup, matchedDay);
                if (!schedule) {
                    return await context.answerCbQuery("❌ Произошла внутреняя ошибка сервера.");
                }

                let getDirectionsEmoji = GetEmojiFromDirection(matchedDirection);
                let getDirectionsName = GetNameFromDirection(matchedDirection);
                let userName: string = GetNameFromContext(context);
                await context.editMessageText(`🖖🏻 <b>${userName}</b>, расписание исходя из ваших параметров готово.\n` +
                                              `👉🏻 <b>Выбранное направление: ${getDirectionsName} ${getDirectionsEmoji}</b>\n` +
                                              `👉🏻 <b>Выбранная группа: ${matchedGroup}</b>\n` +
                                              `📚 <b>Расписание</b>:\n${schedule.map((line, index) => `${index + 1}) ${line}`).join('\n')}`, {
                    parse_mode: "HTML",
                    reply_markup: Markup.inlineKeyboard([
                        Markup.button.callback("👈🏻 Вернуться к выбору дня недели", `_${InlSelectDay}_${userId}_${matchedDirection}_${matchedGroup}_`)
                    ]).reply_markup
                });
            }
        }
    } catch (error) {
        console.log(error)
    }
}