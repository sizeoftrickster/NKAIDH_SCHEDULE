/*
	This is a API_NKAIDH project file.
	Developer: sizeoftrickster <sizeoftrickster@gmail.com>
	
	See more here https://github.com/sizeoftrickster/API_NKAIDH
	
	Copyright (c) 2024 Andrey Gazizov <sizeoftrickster@gmail.com>. All rights reserved.
*/

import{ FastifyBaseLogger, FastifyInstance, FastifyPluginOptions, FastifyTypeProvider, RawServerDefault } from "fastify";
import fastifyPlugin from "fastify-plugin";
import { IncomingMessage, ServerResponse } from "http";

export type TFastifyInstance = FastifyInstance<RawServerDefault, IncomingMessage, ServerResponse<IncomingMessage>, FastifyBaseLogger, FastifyTypeProvider>;
export type TFastifyPluginOptions = FastifyPluginOptions;