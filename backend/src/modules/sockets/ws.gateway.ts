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
import { SocketWIthHandshake } from "../../../types/types";

@WebSocketGateway({ cors: "*"},)
export class WebSocketsGateway implements  OnGatewayInit, OnGatewayDisconnect, OnGatewayConnection{
  @WebSocketServer()  server: Server;
  constructor( private readonly prisma: PrismaService) {
  }
  private activeUsers:number[] = [];
  private idAssociations:any = {};

  private allMessages = [];

  afterInit(server: Server): any {
  }

   handleConnection(client: any): any {
  }

  async handleDisconnect(client: SocketWIthHandshake):  Promise<any>  {
    console.log("updated");
    const {id, active} = client.handshake;
    console.log(id, active);
    if(!active) {
      return;
    }
    this.activeUsers.splice(this.activeUsers.indexOf(id), 1);
    client.handshake = false;
    await this.prisma.users.update({
      where : { id },
      data: {
        active: false,
      }
    });
  }

  @SubscribeMessage("newUser")
  handleNew(@MessageBody("id") id:number,
         @ConnectedSocket() client: Socket){
    console.log(id);
    this.idAssociations[id] = client.id;
    return "received";
  };

  @SubscribeMessage("connected")
  async handleConnect(@MessageBody("id") id:number,
         @ConnectedSocket() client: SocketWIthHandshake){
    this.activeUsers.push(id);
    const update = await this.prisma.users.update({
      where : { id },
      data: {
        active: true,
      }
    });
    console.log("activated");
    client.handshake.active = true;
    client.handshake.id = id;
    if (update) {
      return "Connected";
    } else {
      return "Not Connected";
    }
  };

  @SubscribeMessage("message")
  handleMessage(@MessageBody("from") from:number ,
                @MessageBody("to") to:number,
                @MessageBody("message") message:string,
                @ConnectedSocket() socket: Socket){
    console.log({ from }, { to }, { message });
    const sendingUserId:string = this.idAssociations[to];
    let alreadyMessaged:boolean = false;
    let messageData:any = {};
    this.allMessages.map((e) => {
      if (e.between.includes(from) && e.between.includes(to)) {
        alreadyMessaged = true;
         messageData  = {
          between: e.between,
          messages: [...e.messages, message],
          lastDate: new Date().getDate(),
        }
         return messageData;
      } else {
        return e;
      }
    })
    if (!alreadyMessaged) {
      messageData  = {
        between: [ from, to ],
        lastDate: new Date().getDate(),
        messages: [...message]
      }
      this.allMessages.push(messageData);
    }
    socket.broadcast.to(sendingUserId).emit("message", messageData);
    return "Send";
  }

}

export default WebSocketsGateway;