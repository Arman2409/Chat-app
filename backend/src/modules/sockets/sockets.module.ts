import { Module } from '@nestjs/common';

import WebSocketsGateway from "./ws.gateway";
import { PrismaService } from "nestjs-prisma";
import {SocketsService} from "./sockets.service";


@Module({
 providers: [WebSocketsGateway, PrismaService, SocketsService]
})
export class SocketsModule {};
