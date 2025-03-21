/*
	This is a NKAIDH_BOT_TELEGRAM project file.
	Developer: sizeoftrickster <sizeoftrickster@gmail.com>
	
	See more here https://github.com/sizeoftrickster/NKAIDH_BOT_TELEGRAM
	
	Copyright (c) 2025 Andrey Gazizov <sizeoftrickster@gmail.com>. All rights reserved.
*/

import { Telegraf } from "telegraf";
import { IBotContext } from "./bot.interface";
import { CommandStart } from "./commands/start";
import { AddDeletePinGroupActionsRegExp, GetScheduleActionsRegExp, PinGroupActionsRegExp, ResetPinGroupActionsRegExp, SelectDayActionsRegExp, SelectGroupActionsRegExp, GetCallScheduleRegExp, SendScheduleActionsRegExp } from "./bot.constants";
import { GetScheduleActions } from "./actions/bot.actions.getschedule";
import { SelectGroupActions } from "./actions/bot.actions.selectgroup";
import { SelectDayActions } from "./actions/bot.actions.selectday";
import { SendScheduleActions } from "./actions/bot.actions.sendschedule";
import { AddDeletePinGroupActions, PinGroupActions, ResetPinGroupActions } from "./actions/bot.actions.pingroup";
import { GetCallScheduleActions } from "./actions/bot.actions.getcallschedule";

class CBot
{
    public bot_: Telegraf<IBotContext>;
    
    constructor() {
        this.bot_ = new Telegraf<IBotContext>(
            process.env.TOKEN
        );
    }

    public async Start() {
        try {
            await this.bot_.launch();
        } catch (error) {
            console.log(error)
        }
    }

    public RegisterStart(func: any) {
        try {
            this.bot_.start(func);
        } catch (error) {
            console.log(error)
        }
    }

    public RegisterActions(actions: (any | any)[][]) {
        try {
            actions.forEach((value) => {
                this.bot_.action(value[0], value[1]);
            });
        } catch (error) {
            console.log(error)
        }
    }
}; // class CBot

export const CBotInstance = new CBot();
CBotInstance.RegisterStart(CommandStart);
CBotInstance.RegisterActions([
    [GetScheduleActionsRegExp, GetScheduleActions], 
    [SelectGroupActionsRegExp, SelectGroupActions], 
    [SelectDayActionsRegExp, SelectDayActions], 
    [SendScheduleActionsRegExp, SendScheduleActions],
    [PinGroupActionsRegExp, PinGroupActions],
    [AddDeletePinGroupActionsRegExp, AddDeletePinGroupActions],
    [ResetPinGroupActionsRegExp, ResetPinGroupActions],
    [GetCallScheduleRegExp, GetCallScheduleActions]
]);