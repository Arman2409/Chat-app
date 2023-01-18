import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage, MessageBody, ConnectedSocket
} from "@nestjs/websockets";
import { Server, Socket, } from "socket.io";
import { RequestContext, RequestContextMiddleware } from "nestjs-request-context";
import { UsePipes } from "@nestjs/common";
import { PrismaService } from "nestjs-prisma";

@WebSocketGateway({ cors: "*"},)
export class WebSocketsGateway implements  OnGatewayInit, OnGatewayDisconnect, OnGatewayConnection{
  @WebSocketServer()  server: Server;
  constructor( private readonly prisma: PrismaService) {
  }
  activeUsers:number[] = [];
  idAssociations:any[] = [];

  afterInit(server: Server): any {
  }

  handleConnection(client: any, ...args): any {
  }

  handleDisconnect(client: any): any {
  }

  @SubscribeMessage("connected")
  handle(@MessageBody("id") id:number,
         @ConnectedSocket() client: Socket){
     this.activeUsers.push(id);
     this.idAssociations.push({
       [id]: client.id
     })
    return "received";
  }

  @SubscribeMessage("message")
  handleMessage(@MessageBody("from") from:number ,
                @MessageBody("to") to:number,
                @ConnectedSocket() client: Socket){

    return "received";
  }
}

export default WebSocketsGateway;