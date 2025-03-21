/*
	This is a NKAIDH_BOT_TELEGRAM project file.
	Developer: sizeoftrickster <sizeoftrickster@gmail.com>
	
	See more here https://github.com/sizeoftrickster/NKAIDH_BOT_TELEGRAM
	
	Copyright (c) 2025 Andrey Gazizov <sizeoftrickster@gmail.com>. All rights reserved.
*/
import "dotenv/config";

import { CDatabaseInstance } from "./database/database.class";
import { CBotInstance } from "./bot/bot.class";

async function Main() {
	CDatabaseInstance.Initialize();
	await CBotInstance.Start();
	
}

Main();