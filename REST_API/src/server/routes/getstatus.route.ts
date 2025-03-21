/*
	This is a API_NKAIDH project file.
	Developer: sizeoftrickster <sizeoftrickster@gmail.com>
	
	See more here https://github.com/sizeoftrickster/API_NKAIDH
	
	Copyright (c) 2024 Andrey Gazizov <sizeoftrickster@gmail.com>. All rights reserved.
*/

import { TFastifyInstance, TFastifyPluginOptions } from "../../types/fastify";
import { CAutoTransportXlsxInstance, CRoadConstructionXlsxInstance } from "../../parser/parser.class";
import { CServerInstance } from "../server.class";

export default async function GetStatusRoute(server: TFastifyInstance, _options: TFastifyPluginOptions) {
    server.get("/GetStatus", async (_request, reply) => {
        try {
			await reply.send({
				RoadConstruction: {
					Status: CRoadConstructionXlsxInstance.status,
					LastUpdate: CRoadConstructionXlsxInstance.lastUpdate
				},
				AutoTransport: {
					Status: CAutoTransportXlsxInstance.status,
					LastUpdate: CAutoTransportXlsxInstance.lastUpdate
				}
			}).code(200);
		} catch (error) {
			CServerInstance.GetLog().error(error);
			await reply.send(new Error('Internal server error')).code(500);
		}
    });
}