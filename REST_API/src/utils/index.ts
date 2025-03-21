/*
	This is a API_NKAIDH project file.
	Developer: sizeoftrickster <sizeoftrickster@gmail.com>
	
	See more here https://github.com/sizeoftrickster/API_NKAIDH
	
	Copyright (c) 2024 Andrey Gazizov <sizeoftrickster@gmail.com>. All rights reserved.
*/

import { CDatabaseInstance } from "../database/database.class";
import { IDatabaseInfo } from "../database/database.interface";
import { CParser } from "../parser/parser.class";
import { CServerInstance } from "../server/server.class";

export async function UpdateXlsxTables(directions: CParser[]): Promise<boolean> {
    try {
        for (let value of directions) {
            let Info: IDatabaseInfo | null = await CDatabaseInstance.PrepareSingle<IDatabaseInfo>(`SELECT Link FROM Info WHERE Direction = '${value.direction}'`);
            if (Info && Info.Link) {
                let result = await value.InitializeXLSX(Info.Link);
                if (result) {
                    await CDatabaseInstance.Exec(`UPDATE Info Set LastUpdate = ${value.lastUpdate} WHERE Direction = '${value.direction}'`);
                }
            }
        }
        return true;
    } catch (error) {
        CServerInstance.GetLog().error(error);
        return false;
    }
}