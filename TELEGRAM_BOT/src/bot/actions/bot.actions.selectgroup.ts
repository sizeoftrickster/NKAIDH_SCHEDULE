/*
	This is a NKAIDH_BOT_TELEGRAM project file.
	Developer: sizeoftrickster <sizeoftrickster@gmail.com>
	
	See more here https://github.com/sizeoftrickster/NKAIDH_BOT_TELEGRAM
	
	Copyright (c) 2025 Andrey Gazizov <sizeoftrickster@gmail.com>. All rights reserved.
*/

import { Markup } from "telegraf";
import { InlGetSchedule, InlPinGroup, InlSelectDay, SelectGroupActionsRegExp } from "../bot.constants";
import { CheckInputArgs, GetEmojiFromDirection, GetGroupsNumber, GetNameFromContext, GetNameFromDirection } from "../bot.utils";

function GetGroupsButton(groups: number[], userId: number, matchedDirection: string): any[] | null {
    try {
        let outputButtons: any[] = new Array();
        groups.forEach((value) => {
            outputButtons.push(
                Markup.button.callback(`№ ${value}`, `_${InlSelectDay}_${userId}_${matchedDirection}_${value}_`)
            );
        });
        let getDirectionsEmoji = GetEmojiFromDirection(matchedDirection);
        outputButtons = outputButtons.reduce((acc, n, i) => ((i % 4) || acc.push([]), acc.at(-1).push(n), acc), []);
        outputButtons.unshift([
            Markup.button.callback(`📌 Закрепить определенные группы ${getDirectionsEmoji}`, `_${InlPinGroup}_${userId}_${matchedDirection}_`)
        ]);
        outputButtons.push([
            Markup.button.callback(`👈🏻 Вернуться к выбору направления`, `_${InlGetSchedule}_${userId}_`)
        ]);
        return outputButtons;
    } catch (error) {
        return null;
    }
}

export async function SelectGroupActions(context: any) {
    try {
        let callbackQuery: string = context?.update?.callback_query?.data;
        if (callbackQuery && callbackQuery.search(SelectGroupActionsRegExp) != -1) {
            let matchedArgs: RegExpMatchArray | null = callbackQuery.match(SelectGroupActionsRegExp);
            if (matchedArgs) {
                let userId: number = context?.update.callback_query?.from?.id;
                let matchedUserId: number = Number(matchedArgs[1]);
                let matchedDirection: string = matchedArgs[2];
                
                await CheckInputArgs(context, userId, matchedUserId, matchedDirection);

                let groups = await GetGroupsNumber(matchedDirection);
                if (!groups) {
                    return await context.answerCbQuery("❌ Произошла внутреняя ошибка сервера.");
                }

                let buttons = GetGroupsButton(groups, userId, matchedDirection);
                if (!buttons) {
                    return await context.answerCbQuery("❌ Произошла внутреняя ошибка сервера.");
                }

                let userName: string = GetNameFromContext(context);
                await context.editMessageText(`🖖🏻 <b>${userName}</b>, <b>Выберите необходимый номер группы</b>, чтобы в дальнейшем выбрать день недели.\n` +
                                              `☝🏻 Помимо этого, имеется кнопка "<b>Закрепить определенные группы</b>", ` +
                                              `где <b>можно закрепить группу</b>, которая будет отображаться при <b>использовании команды /start</b>.`, {
                    parse_mode: "HTML",
                    reply_markup: Markup.inlineKeyboard(buttons).reply_markup
                });
            }
        }
        await context.answerCbQuery();
    } catch (error) {
        console.log(error)
    }
}