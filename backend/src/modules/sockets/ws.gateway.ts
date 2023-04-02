import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage, MessageBody, ConnectedSocket
} from "@nestjs/websockets";
import {Server, Socket,} from "socket.io";
import { PrismaService} from "nestjs-prisma";
import {SocketWIthHandshake} from "../../../types/types";
import {SocketsService} from "./sockets.service";

@WebSocketGateway({cors: "*"},)
export class WebSocketsGateway implements OnGatewayInit, OnGatewayDisconnect, OnGatewayConnection {
    @WebSocketServer() server: Server;

    constructor(private readonly prisma: PrismaService, private readonly service: SocketsService) {
    }

    private activeUsers: number[] = [];

    private allMessages = [];

    private previousAllMessages = [];

    afterInit(): any {
         setInterval(() => {
            if (this.previousAllMessages !== this.allMessages) {
                 this.prisma.messages.deleteMany();
                 if (this.allMessages.length) {
                    this.prisma.messages.createMany({data: this.allMessages as any}).then(resp => console.log(resp));
                 }
            }
            this.previousAllMessages = this.allMessages;
        }, 5000);
    }

    handleConnection(client: any): any {
    }

    async handleDisconnect(client: SocketWIthHandshake): Promise<any> {
        const {id, active} = client.handshake;
        if (!active) {
            return;
        }
        this.activeUsers.splice(this.activeUsers.indexOf(id), 1);
        client.handshake = false;
        await this.service.updateUserStatus(id, false);
    }

    @SubscribeMessage("signedIn")
    async handleConnect(
        @MessageBody("id") id: number,
        @ConnectedSocket() client: SocketWIthHandshake) {
        this.activeUsers.push(id);
        const update = this.service.updateUserStatus(id, true, true)
        client.handshake.active = true;
        client.handshake.id = id;
        client.join(id.toString());
        if (update) {
            return "Connected";
        } else {
            return "Not Connected";
        }
    };

    @SubscribeMessage("message")
    handleMessage(@MessageBody("from") from: number,
                  @MessageBody("to") to: number,
                  @MessageBody("message") message: string,
                  ) {
        let alreadyMessaged: boolean = this.allMessages.every(elem => [from, to].indexOf(elem) > -1)
        let messageData = {};
        if (alreadyMessaged) {
        const previousMessaging  = this.allMessages.filter(e => (e.between.includes(from) && e.between.includes(to)))[0];
        messageData = {
            ...previousMessaging,
            messages: [...previousMessaging.messages, message],
            sequence: [...previousMessaging.sequence, previousMessaging.between.indexOf(from)],
            lastDate: new Date().toString().slice(0, 10),
        } 
        this.allMessages.unshift(messageData);
        }
        if (!alreadyMessaged) {
            messageData = {
                between: [from, to],
                sequence: [0],
                messages: [message],
            }
            this.allMessages.unshift(
                {
                    ...messageData,
                    lastDate: new Date().toString().slice(0, 10),
                }
            );
        }
        this.server.sockets.in(to.toString()).emit("message", messageData);
        return messageData;
    }

      @SubscribeMessage("getMessages")
      async handleGetMessages (@MessageBody("interlocuters") interlocuters: number[]) {
          return await this.allMessages.filter(messages => messages.between.includes(interlocuters[0]) && messages.between.includes(interlocuters[0]))[0];
      }
}

export default WebSocketsGateway;