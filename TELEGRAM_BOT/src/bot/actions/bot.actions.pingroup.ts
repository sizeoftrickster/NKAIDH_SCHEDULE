/*
	This is a NKAIDH_BOT_TELEGRAM project file.
	Developer: sizeoftrickster <sizeoftrickster@gmail.com>
	
	See more here https://github.com/sizeoftrickster/NKAIDH_BOT_TELEGRAM
	
	Copyright (c) 2025 Andrey Gazizov <sizeoftrickster@gmail.com>. All rights reserved.
*/

import { Markup } from "telegraf";
import { AddDeletePinGroupActionsRegExp, PinGroupActionsRegExp,
         InlAddDeletePinGroup, InlAddPinGroup, InlDeletePinGroup,
         InlResetPinGroup, ResetPinGroupActionsRegExp,
         InlSelectGroup } from "../bot.constants";
import { CDatabaseInstance } from "../../database/database.class";
import { IUsers } from "../../database/database.interface";
import { GetNameFromContext, CheckInputArgs, GetGroupsNumber } from "../bot.utils";

function GetGroupsButton(groups: number[], userId: number, matchedDirection: string): any[] | null {
    try {
        let getUsersTable = CDatabaseInstance.PrepareSingle<IUsers>(`SELECT Pinned${matchedDirection}Groups FROM Users WHERE Id = ${userId}`);
        if (getUsersTable) {
            let outputButtons: any[] = new Array();
            // @ts-ignore
            let pinnedGroupsArray: string[] = getUsersTable[`Pinned${matchedDirection}Groups`]?.split(",");
            for(let i in groups) {
                if (pinnedGroupsArray && pinnedGroupsArray.indexOf(String(groups[i])) > -1) {
                    outputButtons.push(
                        Markup.button.callback(`✅ ${groups[i]}`, `_${InlAddDeletePinGroup}_${userId}_${matchedDirection}_${groups[i]}_${InlDeletePinGroup}_`)
                    );
                } else {
                    outputButtons.push(
                        Markup.button.callback(`${groups[i]}`, `_${InlAddDeletePinGroup}_${userId}_${matchedDirection}_${groups[i]}_${InlAddPinGroup}_`)
                    );
                }
            }
            outputButtons = outputButtons.reduce((acc, n, i) => ((i % 4) || acc.push([]), acc.at(-1).push(n), acc), []);
            outputButtons = outputButtons.filter(Boolean);
            outputButtons.unshift([
                Markup.button.callback(`🗑 Очистить`, `_${InlResetPinGroup}_${userId}_${matchedDirection}_`)
            ]);
            outputButtons.push([
                Markup.button.callback(`👈🏻 Назад`, `_${InlSelectGroup}_${userId}_${matchedDirection}_`)
            ]);
            return outputButtons;
        }
        return null;
    } catch (error) {
        return null;
    }
}

async function AddDeleteGroups(context: any, userId: number, matchedDirection: string, matchedGroup: string, matchedAction: string): Promise<boolean> {
    try {
        let getUsersTable = CDatabaseInstance.PrepareSingle<IUsers>(`SELECT Pinned${matchedDirection}Groups FROM Users WHERE Id = ${userId}`);
        if (getUsersTable) {
            let result: any[] = [];
            // @ts-ignore
            let pinnedGroupsArray: string[] = getUsersTable[`Pinned${matchedDirection}Groups`]?.split(",");
            if (pinnedGroupsArray) {
                result.push(...pinnedGroupsArray);
            }
            if (matchedAction == InlAddPinGroup) {
                await context.answerCbQuery(`Вы успешно добавили группу №${matchedGroup} в список закрепленных.`);
                result.push(matchedGroup);
            } else {
                await context.answerCbQuery(`Вы успешно убрали группу №${matchedGroup} из списка закрепленных.`);
                result.splice(pinnedGroupsArray.indexOf(matchedGroup), 1);
            }
            result = result.filter(Boolean);
            CDatabaseInstance.Exec(`UPDATE Users SET Pinned${matchedDirection}Groups = '${result}' WHERE Id = ${userId}`);
            return true;
        }
        return false;
    } catch (error) {
        return false;
    }
}

async function ResetGroups(context: any, userId: number, matchedDirection: string): Promise<boolean> {
    try {
        let getUsersTable = CDatabaseInstance.PrepareSingle<IUsers>(`SELECT Pinned${matchedDirection}Groups FROM Users WHERE Id = ${userId}`);
        if (getUsersTable) {
            CDatabaseInstance.Exec(`UPDATE Users SET Pinned${matchedDirection}Groups = '' WHERE Id = ${userId}`);
            await context.answerCbQuery("Вы успешно очистили список закрепленных групп.");
            return true;
        }
        return false;
    } catch (error) {
        return false;
    }
}

export async function PinGroupActions(context: any) {
    try {
        let callbackQuery: string = context?.update?.callback_query?.data;
        if (callbackQuery && callbackQuery.search(PinGroupActionsRegExp) != -1) {
            let matchedArgs: RegExpMatchArray | null = callbackQuery.match(PinGroupActionsRegExp);
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
                await context.editMessageText(`🖖🏻 <b>${userName}</b>, <b>нажмите на кнопку с желаемым номером группы</b>, которые вы желаете, чтобы отображалась в виде кнопки, ` +
                                              `когда вы напишите <b>команду \/start</b>.\n` +
                                              `🤙🏻 Если группа <b>была добавлена</b> в список закрепленных, то слева от <b>номера будет галочка</b> - ✅.\n` +
                                              `👾 Количество добавленных групп(кнопок) <b>ограничивается лимитом Telegram'а</b>, а именно - 100 штук.`, {
                    parse_mode: "HTML",
                    reply_markup: Markup.inlineKeyboard(buttons).reply_markup
                });

            }
            await context.answerCbQuery();
        }
    } catch (error) {
        console.log(error)
    }
}

export async function AddDeletePinGroupActions(context: any) {
    try {
        let callbackQuery: string = context?.update?.callback_query?.data;
        if (callbackQuery && callbackQuery.search(AddDeletePinGroupActionsRegExp) != -1) {
            let matchedArgs: RegExpMatchArray | null = callbackQuery.match(AddDeletePinGroupActionsRegExp);
            if (matchedArgs) {
                let userId: number = context?.update.callback_query?.from?.id;
                let matchedUserId: number = Number(matchedArgs[1]);
                let matchedDirection: string = matchedArgs[2];
                
                await CheckInputArgs(context, userId, matchedUserId, matchedDirection);

                let groups = await GetGroupsNumber(matchedDirection);
                if (!groups) {
                    return await context.answerCbQuery("❌ Произошла внутреняя ошибка сервера.");
                }
                
                let matchedGroup: string = matchedArgs[3];
                let matchedAction: string = matchedArgs[4];
                let adddelete = await AddDeleteGroups(context, userId, matchedDirection, matchedGroup, matchedAction);
                if (!adddelete) {
                    return await context.answerCbQuery("❌ Произошла внутреняя ошибка сервера.");
                }

                let buttons = GetGroupsButton(groups, userId, matchedDirection);
                if (!buttons) {
                    return await context.answerCbQuery("❌ Произошла внутреняя ошибка сервера.");
                }
                   
                let userName: string = GetNameFromContext(context);
                await context.editMessageText(`🖖🏻 <b>${userName}</b>, <b>нажмите на кнопку с желаемым номером группы</b>, которые вы желаете, чтобы отображалась в виде кнопки, ` +
                                              `когда вы напишите <b>команду \/start</b>.\n` +
                                              `🤙🏻 Если группа <b>была добавлена</b> в список закрепленных, то слева от <b>номера будет галочка</b> - ✅.\n` +
                                              `👾 Количество добавленных групп(кнопок) <b>ограничивается лимитом Telegram'а</b>, а именно - 100 штук.`, {
                    parse_mode: "HTML",
                    reply_markup: Markup.inlineKeyboard(buttons).reply_markup
                });
                
            }
            await context.answerCbQuery();
        }
    } catch (error) {
        console.log(error)
    }
}

export async function ResetPinGroupActions(context: any) {
    try {
        let callbackQuery: string = context?.update?.callback_query?.data;
        if (callbackQuery && callbackQuery.search(ResetPinGroupActionsRegExp) != -1) {
            let matchedArgs: RegExpMatchArray | null = callbackQuery.match(ResetPinGroupActionsRegExp);
            if (matchedArgs) {
                let userId: number = context?.update.callback_query?.from?.id;
                let matchedUserId: number = Number(matchedArgs[1]);
                let matchedDirection: string = matchedArgs[2];
                
                await CheckInputArgs(context, userId, matchedUserId, matchedDirection);

                let groups = await GetGroupsNumber(matchedDirection);
                if (!groups) {
                    return await context.answerCbQuery("❌ Произошла внутреняя ошибка сервера.");
                }

                let reset = await ResetGroups(context, userId, matchedDirection);
                if (!reset) {
                    return await context.answerCbQuery("❌ Произошла внутреняя ошибка сервера.");
                }

                let buttons = GetGroupsButton(groups, userId, matchedDirection);
                if (!buttons) {
                    return await context.answerCbQuery("❌ Произошла внутреняя ошибка сервера.");
                }
                    
                let userName: string = GetNameFromContext(context);
                await context.editMessageText(`🖖🏻 <b>${userName}</b>, <b>нажмите на кнопку с желаемым номером группы</b>, которые вы желаете, чтобы отображалась в виде кнопки, ` +
                                              `когда вы напишите <b>команду \/start</b>.\n` +
                                              `🤙🏻 Если группа <b>была добавлена</b> в список закрепленных, то слева от <b>номера будет галочка</b> - ✅.\n` +
                                              `👾 Количество добавленных групп(кнопок) <b>ограничивается лимитом Telegram'а</b>, а именно - 100 штук.`, {
                    parse_mode: "HTML",
                    reply_markup: Markup.inlineKeyboard(buttons).reply_markup
                });
            }
        }
    } catch (error) {
        console.log(error)
    }
}