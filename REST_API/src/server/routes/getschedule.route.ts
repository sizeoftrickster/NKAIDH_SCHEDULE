/*
	This is a API_NKAIDH project file.
	Developer: sizeoftrickster <sizeoftrickster@gmail.com>
	
	See more here https://github.com/sizeoftrickster/API_NKAIDH
	
	Copyright (c) 2024 Andrey Gazizov <sizeoftrickster@gmail.com>. All rights reserved.
*/

import { TFastifyInstance, TFastifyPluginOptions } from "../../types/fastify";
import { CAutoTransportXlsxInstance, CRoadConstructionXlsxInstance } from "../../parser/parser.class";
import { TDirection } from "../../types/parser";
import { CDatabaseInstance } from "../../database/database.class";
import { IDatabaseDays, IDatabaseGroups } from "../../database/database.interface";
import { CServerInstance } from "../server.class";

interface IGetScheduleParams
{
	Direction: TDirection;
	GroupNumber: number;
	DayIndex: number;
};

export default async function GetScheduleRoute(server: TFastifyInstance, _options: TFastifyPluginOptions) {
	server.get("/GetSchedule/:Direction/:GroupNumber/:DayIndex", async function (request, reply) {
		try {
			let { Direction, GroupNumber, DayIndex } = request.params as IGetScheduleParams;
			switch (Direction) {
				case ("RC"): {
					let Days = await CDatabaseInstance.PrepareSingle<IDatabaseDays>(`SELECT RowStart, RowEnd FROM Days WHERE Direction = 'RC' AND DayIndex = ${DayIndex}`);
					let Groups = await CDatabaseInstance.PrepareSingle<IDatabaseGroups>(`SELECT ColumnStart, ColumnEnd FROM Groups WHERE Direction = 'RC' AND Number = ${GroupNumber}`);
					if (Days && Groups) {
						let schedule = CRoadConstructionXlsxInstance.GetSchedule(Days.RowStart, Days.RowEnd, Groups.ColumnStart, Groups.ColumnEnd, DayIndex);
						return await reply.send(schedule);
					}
					break;
				}
				case ("AT"): {
					let Days = await CDatabaseInstance.PrepareSingle<IDatabaseDays>(`SELECT RowStart, RowEnd FROM Days WHERE Direction = 'AT' AND DayIndex = ${DayIndex}`);
					let Groups = await CDatabaseInstance.PrepareSingle<IDatabaseGroups>(`SELECT ColumnStart, ColumnEnd FROM Groups WHERE Direction = 'AT' AND Number = ${GroupNumber}`);
					if (Days && Groups) {
						let schedule = CAutoTransportXlsxInstance.GetSchedule(Days.RowStart, Days.RowEnd, Groups.ColumnStart, Groups.ColumnEnd, DayIndex);
						return await reply.send(schedule);
					}
					break;
				}
				default: {
					return await reply.send(new Error(`Direction: ${Direction} is not supported.`)).code(400);
				}
			}
		} catch (error) {
			CServerInstance.GetLog().error(error);
			await reply.send(new Error('Internal server error')).code(500);
		}
	});
}