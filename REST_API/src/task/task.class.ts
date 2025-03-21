/*
	This is a API_NKAIDH project file.
	Developer: sizeoftrickster <sizeoftrickster@gmail.com>
	
	See more here https://github.com/sizeoftrickster/API_NKAIDH
	
	Copyright (c) 2024 Andrey Gazizov <sizeoftrickster@gmail.com>. All rights reserved.
*/

import cron from "node-cron";

export class CTask
{
    protected time: string;
    public task: cron.ScheduledTask;

    constructor(time: string, callback: string | ((now: Date | "manual" | "init") => void)) {
        this.time = time;
        this.task = cron.schedule(this.time, callback);
    }
}; // export class CTask