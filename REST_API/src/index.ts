/*
	This is a API_NKAIDH project file.
	Developer: sizeoftrickster <sizeoftrickster@gmail.com>
	
	See more here https://github.com/sizeoftrickster/API_NKAIDH
	
	Copyright (c) 2024 Andrey Gazizov <sizeoftrickster@gmail.com>. All rights reserved.
*/

import "dotenv/config";

import { CDatabaseInstance } from "./database/database.class";
import { CAutoTransportXlsxInstance, CRoadConstructionXlsxInstance } from "./parser/parser.class";
import { UpdateXlsxTables } from "./utils";

import GetStatusRoute from "./server/routes/getstatus.route";
import GetScheduleRoute from "./server/routes/getschedule.route";

import { CServerInstance } from "./server/server.class";

import { TaskAutoUpdate } from "./task/tasks/autoupdate.task";
import GetGroups from "./server/routes/getgroups.route";

async function Main() {
    try {
        await CDatabaseInstance.Initialize();
        await UpdateXlsxTables([CAutoTransportXlsxInstance, CRoadConstructionXlsxInstance]);
        CServerInstance.RegisterRoutes([GetStatusRoute, GetScheduleRoute, GetGroups]);
        TaskAutoUpdate.task.start();
        await CServerInstance.Initialize();
    } catch (error) {
        CServerInstance.GetLog().error(error);
    }
}

Main();