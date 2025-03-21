/*
	This is a API_NKAIDH project file.
	Developer: sizeoftrickster <sizeoftrickster@gmail.com>
	
	See more here https://github.com/sizeoftrickster/API_NKAIDH
	
	Copyright (c) 2024 Andrey Gazizov <sizeoftrickster@gmail.com>. All rights reserved.
*/

import { TDayString, TDirection } from "../types/parser";

export interface IDatabaseInfo
{
    Direction: TDirection;
    Link: string;
	Row: number;
	Column: string;
}; // export interface IDatabaseInfo

export interface IDatabaseDays
{
	Direction: TDirection;
	Day: TDayString;
	RowStart: number;
	RowEnd: number;
}; // export interface IDays

export interface IDatabaseGroups
{
	Direction: TDirection;
	Number: number;
	ColumnStart: string;
	ColumnEnd: string;
}; // export interface IDatabaseGroups