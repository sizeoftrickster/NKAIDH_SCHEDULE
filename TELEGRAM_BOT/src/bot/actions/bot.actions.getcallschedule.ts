/*
	This is a NKAIDH_BOT_TELEGRAM project file.
	Developer: sizeoftrickster <sizeoftrickster@gmail.com>
	
	See more here https://github.com/sizeoftrickster/NKAIDH_BOT_TELEGRAM
	
	Copyright (c) 2025 Andrey Gazizov <sizeoftrickster@gmail.com>. All rights reserved.
*/

import { Context } from "telegraf";
import { GetCallScheduleRegExp } from "../bot.constants";
import { readFileSync } from "fs";
import axios from "axios";
import { GetNameFromContext } from "../bot.utils";

export async function GetCallScheduleActions(context: any) {
	try {
		let callbackQuery: string = context?.update?.callback_query?.data;
        if (callbackQuery && callbackQuery.search(GetCallScheduleRegExp) != -1) {
            let matchedArgs: RegExpMatchArray | null = callbackQuery.match(GetCallScheduleRegExp);
            if (matchedArgs) {
                let matchedUserId: number = Number(matchedArgs[1]);
                let userId: number = context?.update.callback_query?.from?.id;
                if (matchedUserId != userId) {
                    return await context.answerCbQuery("❌ Вы не можете использовать кнопки данного сообщения. Для взаимодействия напишите /start.")
                }
				let userName: string = GetNameFromContext(context);
				await context.editMessageMedia({
					type: "photo",
					media: {
						source: readFileSync("./call.jpg")
					},
					caption: `🖖🏻 <b>${userName}</b>, держите фотографию с расписанием звонков.`,
					parse_mode: "HTML"
				});
			}
		}
	} catch (error) {
		console.log(error)
	}
}