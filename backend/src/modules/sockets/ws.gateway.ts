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
  idAssociations:any = {};

  participants = new Map();

  afterInit(server: Server): any {
  }

  handleConnection(client: any, ...args): any {
  }

  handleDisconnect(client: any): any {
  }

  @SubscribeMessage("newUser")
  handleNew(@MessageBody("id") id:number,
         @ConnectedSocket() client: Socket){
     this.idAssociations.id = client.id;
    return "received";
  };

  @SubscribeMessage("connected")
  async handleConnect(@MessageBody("id") id:number,
         @ConnectedSocket() client: Socket){
    this.activeUsers.push(id);
    const update = this.prisma.users.update({
      where : { id },
      data: {
        active: true,
      }
    });
    if(id == 1) client.join("112")
    if (update) {
      return "Connect";
    } else {
      return "Not Connected";
    }
  };

  @SubscribeMessage("message")
  handleMessage(@MessageBody("from") from:number ,
                @MessageBody("to") to:number,
                @ConnectedSocket() socket: Socket){
    console.log(socket.rooms);
    this.server.local.to("112").emit("hello", {data: "blblbl"})
    socket.local.emit("hello", {data: "cool data"})
    // client.broadcast.to("112").emit("hello", {data: "313122"});
    return "Received";
  }

  @SubscribeMessage("hello")
  got (
    @MessageBody() data:any,
    @ConnectedSocket() socket:Socket
  ){
    if(socket.id == this.idAssociations["1"]) {
      console.log({ data }, "data");
    }
    console.log("helloed");
  }
}

export default WebSocketsGateway;