/*
	This is a API_NKAIDH project file.
	Developer: sizeoftrickster <sizeoftrickster@gmail.com>
	
	See more here https://github.com/sizeoftrickster/API_NKAIDH
	
	Copyright (c) 2024 Andrey Gazizov <sizeoftrickster@gmail.com>. All rights reserved.
*/

import { resolve } from "node:path";
import { cwd } from "node:process";
import BetterSqlite from "better-sqlite3";
import { CServerInstance } from "../server/server.class";

class CDatabase
{
	private database_!: BetterSqlite.Database;
	private filename_: string;
    
	constructor(filename: string) {
		this.filename_ = filename;
	}

	public Initialize() {
		try {
			this.database_ = new BetterSqlite(
            	resolve(cwd(), this.filename_)
        	); 
		} catch (error) {
			CServerInstance.GetLog().error(error);
		}
	}

	public Get(): BetterSqlite.Database {
		return this.database_;
	}

	public async Prepare<Interface>(source: string): Promise<Interface[] | null> {
		try {
			return await this.database_.prepare(source).all() as Interface[];
		} catch (error) {
			CServerInstance.GetLog().error(error);
			return null;
		}
	}
	public async PrepareSingle<Interface>(source: string): Promise<Interface | null> {
		try {
			let result = await this.database_.prepare(source).all() as Interface[];
			return result[0];
		} catch (error) {
			CServerInstance.GetLog().error(error);
			return null;
		}
	}

	public async Exec(source: string): Promise<boolean> {
		try {
			await this.database_.exec(source);
			return true;
		} catch (error) {
			CServerInstance.GetLog().error(error);
			return false;
		}
	}
}; // class CDatabase

export const CDatabaseInstance = new CDatabase("database.db");