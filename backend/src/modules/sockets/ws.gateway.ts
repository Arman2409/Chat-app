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
import {SocketsService} from "./sockets.service";

@WebSocketGateway({ cors: "*"},)
export class WebSocketsGateway implements  OnGatewayInit, OnGatewayDisconnect, OnGatewayConnection{
  @WebSocketServer()  server: Server;
  constructor( private readonly prisma: PrismaService, private readonly service: SocketsService) {
  }
  private activeUsers:number[] = [];
  private idAssociations:any = {};

  private allMessages = [];

  afterInit(server: Server): any {
  }

   handleConnection(client: any): any {
     console.log("connection");
  }

  async handleDisconnect(client: SocketWIthHandshake):  Promise<any>  {
    console.log("disconnected");
    const {id, active} = client.handshake;
    console.log(id, active);
    if(!active) {
      return;
    }
    this.activeUsers.splice(this.activeUsers.indexOf(id), 1);
    client.handshake = false;
    await this.service.updateUserStatus(id, false);
  }

  // @SubscribeMessage("newUser")
  // handleNew(@MessageBody("id") id:number,
  //        @ConnectedSocket() client: Socket){
  //   return "received";
  // };

  @SubscribeMessage("connected")
  async handleConnect(@MessageBody("id") id:number,
         @ConnectedSocket() client: SocketWIthHandshake){
    this.activeUsers.push(id);
    const update = this.service.updateUserStatus(id, true, true)
    client.handshake.active = true;
    client.handshake.id = id;
    console.log("connected", client.id);
    client.join(id.toString());
    // this.idAssociations[id] = client.id;
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
                @ConnectedSocket() socket: SocketWIthHandshake){
    console.log({ from }, { to }, { message });
    const sendingUserId:string = this.idAssociations[to];
    let alreadyMessaged:boolean = false;
    let messageData:any = {};
    const newAllMessages = this.allMessages.map((e) => {
      if (e.between.includes(from) && e.between.includes(to)) {
        alreadyMessaged = true;
         messageData  = {
          between: e.between,
          messages: [...e.messages, message],
           sequence: [...e.sequence, e.between.indexOf(from)],
          lastDate: new Date().toString().slice(0,10),
        }
         return messageData;
      } else {
        return e;
      }
    })
    if (!alreadyMessaged) {
      messageData  = {
        between: [ from, to ],
        sequence: [ 0 ],
        messages: [message],
      }
      this.allMessages.push(
          {...messageData,
            lastDate: new Date().toString().slice(0,10),
          }
          );
    } else {
      this.allMessages = newAllMessages;
    }
    console.log(messageData);
    console.log(this.allMessages);
    console.log(from, to)
    console.log(this.idAssociations);
    console.log(sendingUserId)
    console.log(socket.rooms);
    this.server.sockets.in(to.toString()).emit("message", messageData);
    // socket.broadcast.to(sendingUserId).emit("message", messageData);
    return messageData;
  }

}

export default WebSocketsGateway;