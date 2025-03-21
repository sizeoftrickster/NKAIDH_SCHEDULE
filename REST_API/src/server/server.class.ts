/*
	This is a API_NKAIDH project file.
	Developer: sizeoftrickster <sizeoftrickster@gmail.com>
	
	See more here https://github.com/sizeoftrickster/API_NKAIDH
	
	Copyright (c) 2024 Andrey Gazizov <sizeoftrickster@gmail.com>. All rights reserved.
*/

import Fastify, { FastifyPluginCallback } from "fastify";
import { TFastifyInstance } from "../types/fastify";
import FastifyPlugin from "fastify-plugin";

class CServer
{
    protected fastify: TFastifyInstance;
    private port: number = process.env.PORT || 3000;

    constructor() {
        this.fastify = Fastify({
            logger: {
                transport: {
                    targets: [
                        {
                            level: "error",
                            target: "pino/file",
                            options: { destination: "./logs.log" }
                        }
                    ]
                }
            },
        });
    }

    public GetLog() {
        return this.fastify.log;
    }
    
    public RegisterRoute(route: FastifyPluginCallback) {
        this.fastify.register(FastifyPlugin(route));
    }
    
    public RegisterRoutes(routes: FastifyPluginCallback[]) {
        for (let route of routes) {
            this.fastify.register(FastifyPlugin(route))
        }
    }

    public async Initialize() {
        try {
            await this.fastify.listen({ 
                port: this.port,
                host: "147.45.147.128"
            });
        } catch (error) {
            this.fastify.log.error(error);
            process.exit(1);
        }
    }
}; // class CServer

export const CServerInstance = new CServer();