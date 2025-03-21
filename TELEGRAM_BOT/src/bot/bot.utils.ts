/*
	This is a NKAIDH_BOT_TELEGRAM project file.
	Developer: sizeoftrickster <sizeoftrickster@gmail.com>
	
	See more here https://github.com/sizeoftrickster/NKAIDH_BOT_TELEGRAM
	
	Copyright (c) 2025 Andrey Gazizov <sizeoftrickster@gmail.com>. All rights reserved.
*/

import axios from "axios";
import { InlDirectionRC, InlDirectionAT } from "./bot.constants";

export const GetNameFromContext = function( context: any ) {
    // Default context
    if ( context.message?.from?.username != undefined ) {
        return "@" + context.message?.from?.username;
    // Callback query context
    } else if ( context.update?.callback_query?.from?.username != undefined ) {
        return "@" + context.update?.callback_query?.from?.username;
    }
    // If username is null
    return context.message?.from?.first_name != undefined ? context.message?.from?.first_name : context.update?.callback_query?.from?.first_name;
}

export async function CheckInputId(context: any, userId: number, matchedUserId: number) {
    if (userId != matchedUserId) {
        return await context.answerCbQuery("❌ Вы не можете использовать кнопки данного сообщения. Для взаимодействия напишите /start.");
    }
}

export async function CheckInputArgs(context: any, userId: number, matchedUserId: number, matchedDirection: string) {
    if (userId != matchedUserId) {
        return await context.answerCbQuery("❌ Вы не можете использовать кнопки данного сообщения. Для взаимодействия напишите /start.");
    }
    if (matchedDirection != InlDirectionRC && matchedDirection != InlDirectionAT) {
        return await context.answerCbQuery("❌ Вы выбрали несуществующее направление. Для взаимодействия напишите /start.");
    }
}

export async function GetGroupsNumber(matchedDirection: string): Promise<number[] | null> {
    try {
        let getGroupsRequest = await axios.get(`${process.env.API}/GetGroups/${matchedDirection}`);
        if (getGroupsRequest && getGroupsRequest.status == 200) {
            return getGroupsRequest.data;
        }
        return null;
    } catch (error) {
        return null;
    }
}
export async function GetSchedule(matchedDirection: string, matchedGroup: string, matchedDay: string): Promise<string[] | null> {
    try {
        let getScheduleRequest = await axios.get(`${process.env.API}/GetSchedule/${matchedDirection}/${matchedGroup}/${matchedDay}`);
        if (getScheduleRequest && getScheduleRequest.status == 200) {
            return getScheduleRequest.data;
        }
        return null;
    } catch (error) {
        return null;
    }
}

export const Days = [[1, "Понедельник"], [2, "Вторник"], [3, "Среда"], [4, "Четверг"], [5, "Пятница"], [6, "Суббота"]];

export const GetEmojiFromDirection = function(direction: string) {
    return direction == "RC" ? "🚜" : "🚙";
}
export const GetNameFromDirection = function(direction: string) {
    return direction == "RC" ? "Дорожно-строительное" : "Авто-транспортное";
}