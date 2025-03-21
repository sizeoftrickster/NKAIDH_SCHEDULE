/*
	This is a NKAIDH_BOT_TELEGRAM project file.
	Developer: sizeoftrickster <sizeoftrickster@gmail.com>
	
	See more here https://github.com/sizeoftrickster/NKAIDH_BOT_TELEGRAM
	
	Copyright (c) 2025 Andrey Gazizov <sizeoftrickster@gmail.com>. All rights reserved.
*/

/*
	SendCallSchedule
	GetSchedule(SelectDirection) → SelectGroup → SelectDay → Schedule
									    ↓↑                         
								   PinnedGroups
*/
export const InlDirectionRC: string = "RC";
export const InlDirectionAT: string = "AT";

export const InlGetSchedule = "GetSchedule";
export const GetScheduleActionsRegExp = new RegExp(`_${InlGetSchedule}_(\\d+)_`);

export const InlSelectGroup = "SelectGroup";
export const SelectGroupActionsRegExp = new RegExp(`_${InlSelectGroup}_(\\d+)_(${InlDirectionRC}||${InlDirectionAT})_`);

export const InlPinGroup = "PinGroup";
export const PinGroupActionsRegExp = new RegExp(`_${InlPinGroup}_(\\d+)_(${InlDirectionRC}||${InlDirectionAT})_`);

export const InlAddPinGroup = "AddPinGroup";
export const InlDeletePinGroup = "DeletePinGroup";
export const InlAddDeletePinGroup = "AddDeletePinGroup";
export const AddDeletePinGroupActionsRegExp = new RegExp(`_${InlAddDeletePinGroup}_(\\d+)_(${InlDirectionRC}||${InlDirectionAT})_(\\d+)_(${InlAddPinGroup}||${InlDeletePinGroup})_`);

export const InlResetPinGroup = "ResetPinGroup";
export const ResetPinGroupActionsRegExp = new RegExp(`_${InlResetPinGroup}_(\\d+)_(${InlDirectionRC}||${InlDirectionAT})_`);

export const InlSelectDay = "SelectDay";
export const SelectDayActionsRegExp = new RegExp(`_${InlSelectDay}_(\\d+)_(${InlDirectionRC}||${InlDirectionAT})_(\\d+)_`);

export const InlSendSchedule = "SendSchedule";
export const SendScheduleActionsRegExp = new RegExp(`_${InlSendSchedule}_(\\d+)_(${InlDirectionRC}||${InlDirectionAT})_(\\d+)_(\\d+)_`);

export const InlGetCallSchedule = "GetCallSchedule";
export const GetCallScheduleRegExp = new RegExp(`_${InlGetCallSchedule}_(\\d+)_`);