/*
	This is a NKAIDH_BOT_TELEGRAM project file.
	Developer: sizeoftrickster <sizeoftrickster@gmail.com>
	
	See more here https://github.com/sizeoftrickster/NKAIDH_BOT_TELEGRAM
	
	Copyright (c) 2025 Andrey Gazizov <sizeoftrickster@gmail.com>. All rights reserved.
*/

import { resolve } from "node:path";
import { cwd } from "node:process";
import BetterSqlite from "better-sqlite3";

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
			console.log(error);
		}
	}

	public Get(): BetterSqlite.Database {
		return this.database_;
	}

	public Prepare<Interface>(source: string): Interface[] | null {
		try {
			return this.database_.prepare(source).all() as Interface[];
		} catch (error) {
			console.log(error)
			return null;
		}
	}
	public PrepareSingle<Interface>(source: string): Interface | null {
		try {
			let result = this.database_.prepare(source).all() as Interface[];
			return result[0];
		} catch (error) {
			console.log(error)
			return null;
		}
	}

	public Exec(source: string): boolean {
		try {
			this.database_.exec(source);
			return true;
		} catch (error) {
			console.log(error)
			return false;
		}
	}
}; // class CDatabase

export const CDatabaseInstance = new CDatabase("database.db");