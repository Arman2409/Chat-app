import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage, MessageBody
} from "@nestjs/websockets";
import { Server, Socket, } from "socket.io";
import { RequestContext, RequestContextMiddleware } from "nestjs-request-context";
import { UsePipes } from "@nestjs/common";
import { PrismaService } from "nestjs-prisma";

const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);
@WebSocketGateway({ cors: "*"},)
export class WebSocketsGateway implements  OnGatewayInit, OnGatewayDisconnect, OnGatewayConnection{
  @WebSocketServer()  server: Server;
  constructor( private readonly prisma: PrismaService) {
  }
  activeUsers:number[] = [];
  afterInit(server: Server): any {
    console.log("init", server);
  }

  handleConnection(client: any, ...args): any {
    console.log("connect", client, ...args);
    console.log(client.handshake.query);
    console.log(args);
  }

  handleDisconnect(client: any): any {
    console.log("disconnect", client);
  }

  @SubscribeMessage("connected")
  handleMessage(@MessageBody("id") id:number){
     this.activeUsers.push(id);
  }
}

export default WebSocketsGateway;