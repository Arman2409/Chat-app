import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage, MessageBody, ConnectedSocket
} from "@nestjs/websockets";
import { Server, Socket, } from "socket.io";
import { PrismaService } from "nestjs-prisma";

@WebSocketGateway({ cors: "*"},)
export class WebSocketsGateway implements  OnGatewayInit, OnGatewayDisconnect, OnGatewayConnection{
  @WebSocketServer()  server: Server;
  constructor( private readonly prisma: PrismaService) {
  }
  activeUsers:number[] = [];
  idAssociations:any = {};

  afterInit(server: Server): any {
  }

  handleConnection(client: any, ...args): any {
  }

  handleDisconnect(client: any): any {
  }

  @SubscribeMessage("newUser")
  handleNew(@MessageBody("id") id:number,
         @ConnectedSocket() client: Socket){
    this.idAssociations[id] = client.id;
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
    console.log(this.idAssociations);
    console.log(from,to);
    const sendingUserId = this.idAssociations[to];
    console.log(sendingUserId);
    socket.to(sendingUserId).emit("hello", {data: "bbgf"})
    // client.broadcast.to("112").emit("hello", {data: "313122"});
    return "Received";
  }

  @SubscribeMessage("hello")
  hello() {
    console.log("hello");
  }
}

export default WebSocketsGateway;