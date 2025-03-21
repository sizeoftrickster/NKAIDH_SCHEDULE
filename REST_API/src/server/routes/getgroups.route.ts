/*
	This is a API_NKAIDH project file.
	Developer: sizeoftrickster <sizeoftrickster@gmail.com>
	
	See more here https://github.com/sizeoftrickster/API_NKAIDH
	
	Copyright (c) 2024 Andrey Gazizov <sizeoftrickster@gmail.com>. All rights reserved.
*/

import { CDatabaseInstance } from "../../database/database.class";
import { IDatabaseGroups } from "../../database/database.interface";
import { TFastifyInstance, TFastifyPluginOptions } from "../../types/fastify";
import { TDirection } from "../../types/parser";
import { CServerInstance } from "../server.class";

interface IGetGroupsParams
{
    Direction: TDirection;
};

export default async function GetGroups(server: TFastifyInstance, _options: TFastifyPluginOptions) {
    server.get("/GetGroups/:Direction", async function (request, reply) {
        try {
            let { Direction } = request.params as IGetGroupsParams;
            switch(Direction) {
                case ("RC"): {
                    let Groups = await CDatabaseInstance.Prepare<IDatabaseGroups>(`SELECT Number FROM Groups WHERE Direction = 'RC'`);
                    if (Groups) {
                        let parsedGroups: number[] = Groups.map(value => value.Number)
                        return await reply.send(parsedGroups);
                    }
                    break;
                }
                case ("AT"): {
                    let Groups = await CDatabaseInstance.Prepare<IDatabaseGroups>(`SELECT Number FROM Groups WHERE Direction = 'AT'`);
                    if (Groups) {
                        let parsedGroups: number[] = Groups.map(value => value.Number)
                        return await reply.send(parsedGroups);
                    }
                    break;
                }
                default: {
                    return await reply.send(new Error(`Direction: ${Direction} is not supported.`)).code(400);
                }
            }
        } catch (error) {
            console.log(error)
            //CServerInstance.GetLog().error(error);
			await reply.send(new Error('Internal server error')).code(500);
        }
    });
}