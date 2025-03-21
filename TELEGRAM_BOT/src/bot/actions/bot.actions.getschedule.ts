/*
	This is a NKAIDH_BOT_TELEGRAM project file.
	Developer: sizeoftrickster <sizeoftrickster@gmail.com>
	
	See more here https://github.com/sizeoftrickster/NKAIDH_BOT_TELEGRAM
	
	Copyright (c) 2025 Andrey Gazizov <sizeoftrickster@gmail.com>. All rights reserved.
*/

import { Markup } from "telegraf";
import { GetScheduleActionsRegExp, InlDirectionAT, InlDirectionRC, InlSelectGroup } from "../bot.constants";
import { CheckInputId, GetNameFromContext } from "../bot.utils";

export async function GetScheduleActions(context: any) {
    try {
        let callbackQuery: string = context?.update?.callback_query?.data;
        if (callbackQuery && callbackQuery.search(GetScheduleActionsRegExp) != -1) {
            let matchedArgs: RegExpMatchArray | null = callbackQuery.match(GetScheduleActionsRegExp);
            if (matchedArgs) {
                let userId: number = context?.update.callback_query?.from?.id;
                let matchedUserId: number = Number(matchedArgs[1]);
                
                await CheckInputId(context, userId, matchedUserId);

                let userName: string = GetNameFromContext(context);
                await context.editMessageText(`🖖🏻 <b>${userName}</b>, <b>выберите необходимое направление</b>, чтобы в дальнейшем выбрать номер группы.\n`, {
                    parse_mode: "HTML",
                    reply_markup: Markup.inlineKeyboard([
                        [Markup.button.callback(`🚜 Дорожно-строительное`, `_${InlSelectGroup}_${userId}_${InlDirectionRC}_`)], 
                        [Markup.button.callback(`🚙 Авто-транспортное`, `_${InlSelectGroup}_${userId}_${InlDirectionAT}_`)]
                    ]).reply_markup
                });
            }
            await context.answerCbQuery();
        }
    } catch (error) {
        console.log(error)
    }
}