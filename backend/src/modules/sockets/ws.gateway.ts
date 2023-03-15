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

    private updateMessagesInterval = null;

    afterInit(server: Server): any {
         this.updateMessagesInterval = setInterval(() => {
            if (this.previousAllMessages !== this.allMessages) {
                 this.prisma.messages.deleteMany();
                 this.prisma.messages.createMany({data: this.allMessages as any}).then(resp => console.log(resp));
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
        @MessageBody("socketId") socketId: number,
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
                  @ConnectedSocket() socket: SocketWIthHandshake) {
        console.log({from}, {to}, {message});
        let alreadyMessaged: boolean = false;
        let messageData: any = {};
        const newAllMessages = this.allMessages.map((e) => {
            if (e.between.includes(from) && e.between.includes(to)) {
                alreadyMessaged = true;
                messageData = {
                    between: e.between,
                    messages: [...e.messages, message],
                    sequence: [...e.sequence, e.between.indexOf(from)],
                    lastDate: new Date().toString().slice(0, 10),
                }
                return messageData;
            } else {
                return e;
            }
        })
        if (!alreadyMessaged) {
            messageData = {
                between: [from, to],
                sequence: [0],
                messages: [message],
            }
            this.allMessages.push(
                {
                    ...messageData,
                    lastDate: new Date().toString().slice(0, 10),
                }
            );
        } else {
            this.allMessages = newAllMessages;
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