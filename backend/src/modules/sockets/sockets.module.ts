import { Module } from '@nestjs/common';

import WebSocketsGateway from "./ws.gateway";
import { PrismaService } from "nestjs-prisma";


@Module({
 providers: [WebSocketsGateway, PrismaService]
})
export class SocketsModule {};
