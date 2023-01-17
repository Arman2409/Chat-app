import { Module } from '@nestjs/common';
import { Server, Socket} from "socket.io";
import { RequestContext } from "nestjs-request-context";
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage
} from "@nestjs/websockets";

import { SocketsService } from './sockets.service';
import { UserReq } from "../../../types/types";
import WebSocketsGateway from "./ws.gateway";
import { PrismaService } from "nestjs-prisma";

// @Module({
//   providers: [SocketsService]
// })
// export class SocketsModule {}

// @WebSocketGateway({ cors: "*"})
@Module({
 providers: [WebSocketsGateway, PrismaService]
})
export class SocketsModule {};
// export class WebSocketsGateway implements  OnGatewayInit, OnGatewayDisconnect, OnGatewayConnection{
//   @WebSocketServer()  server: Server;
//
//   afterInit(server: Server): any {
//     console.log("init", server);
//   }
//
//   handleConnection(client: any, ...args): any {
//     console.log("connect", client, ...args);
//     const req: UserReq = RequestContext.currentContext.req;
//     req.session.user.active = true;
//     // const updating =
//
//   }
//
//   handleDisconnect(client: any): any {
//     console.log("disconnect", client);
//   }
//
//   @SubscribeMessage("msg")
//   handleMessage(){
//     console.log("hello");
//   }
// }