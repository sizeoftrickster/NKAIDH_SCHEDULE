/*
	This is a NKAIDH_BOT_TELEGRAM project file.
	Developer: sizeoftrickster <sizeoftrickster@gmail.com>
	
	See more here https://github.com/sizeoftrickster/NKAIDH_BOT_TELEGRAM
	
	Copyright (c) 2025 Andrey Gazizov <sizeoftrickster@gmail.com>. All rights reserved.
*/

import { InlSelectGroup, InlSendSchedule, SelectDayActionsRegExp } from "../bot.constants";
import { CheckInputArgs, Days, GetEmojiFromDirection, GetNameFromContext, GetNameFromDirection } from "../bot.utils";
import { Markup } from "telegraf";

function GetGroupsButton(userId: number, matchedDirection: string, matchedGroup: string) {
    try {
        let outputButtons: any[] = new Array();
        Days.forEach((value, index) => {
            if (value[0] == new Date().getDay()) {
                outputButtons.push([
                    Markup.button.callback(`📆 ${value[1]} 📆`, `_${InlSendSchedule}_${userId}_${matchedDirection}_${matchedGroup}_${index+1}_`)
                ]);
            } else {
                outputButtons.push([
                    Markup.button.callback(`${value[1]}`, `_${InlSendSchedule}_${userId}_${matchedDirection}_${matchedGroup}_${index+1}_`)
                ]);
            }
        });
        outputButtons.push([
            Markup.button.callback(`👈🏻 Вернуться к выбору номера группы`, `_${InlSelectGroup}_${userId}_${matchedDirection}_`)
        ]);
        return outputButtons;
    } catch (error) {
        return null;
    }
}

export async function SelectDayActions(context: any) {
    try {
        let callbackQuery: string = context?.update?.callback_query?.data;
        if (callbackQuery && callbackQuery.search(SelectDayActionsRegExp) != -1) {
            let matchedArgs: RegExpMatchArray | null = callbackQuery.match(SelectDayActionsRegExp);
            if (matchedArgs) {
                let userId: number = context?.update.callback_query?.from?.id;
                let matchedUserId: number = Number(matchedArgs[1]);
                let matchedDirection: string = matchedArgs[2];
                
                await CheckInputArgs(context, userId, matchedUserId, matchedDirection);
                
                let matchedGroup: string = matchedArgs[3];

                let buttons = GetGroupsButton(userId, matchedDirection, matchedGroup);
                if (!buttons) {
                    return await context.answerCbQuery("❌ Произошла внутреняя ошибка сервера.");
                }

                let getDirectionsEmoji = GetEmojiFromDirection(matchedDirection);
                let getDirectionsName = GetNameFromDirection(matchedDirection);
                let userName: string = GetNameFromContext(context);
                await context.editMessageText(`🖖🏻 <b>${userName}</b>, <b>выберите необходимый день недели</b>, чтобы в дальнейшем получить расписание.\n` +
                                              `👉🏻 <b>Выбранное направление</b>: ${getDirectionsName} ${getDirectionsEmoji}\n` +
                                              `😽 <b>Выбранная группа</b>: ${matchedGroup}\n` +
                                              `👇🏻 <b>Символ возле дня недели 📆 обозначает текущий день недели.</b>`, {
                    parse_mode: "HTML",
                    reply_markup: Markup.inlineKeyboard(buttons).reply_markup
                });
            }
        }
    } catch (error) {
        console.log(error)
    }
}