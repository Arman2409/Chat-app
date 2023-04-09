import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage, MessageBody, ConnectedSocket
} from "@nestjs/websockets";
import {Server} from "socket.io";
import {PrismaService} from "nestjs-prisma";

import {SocketWIthHandshake} from "../../../types/types";
import {SocketsService} from "./sockets.service";

@WebSocketGateway({ cors: "*" },)
export class WebSocketsGateway implements OnGatewayInit, OnGatewayDisconnect, OnGatewayConnection {
    @WebSocketServer() server: Server;

    constructor(private readonly prisma: PrismaService, private readonly service: SocketsService) {
    }

    private activeUsers: string[] = [];

    private allMessages = [];

    private previousAllMessages = [];

    afterInit(): any {
        setInterval(() => {
            if (this.previousAllMessages !== this.allMessages) {
                this.prisma.messages.deleteMany();
                if (this.allMessages.length) {
                    this.prisma.messages.createMany({ data: this.allMessages as any });
                }
            }
            this.previousAllMessages = this.allMessages;
        }, 5000);
    }

    handleConnection(client: any): any {
    }

    async handleDisconnect(client: SocketWIthHandshake): Promise<any> {
        const { id, active } = client.handshake;
        if (!active || !id) {
            return;
        }
        this.activeUsers.splice(this.activeUsers.indexOf(id), 1);
        await this.service.updateUserStatus(id, false);
    }

    @SubscribeMessage("signedIn")
    async handleConnect(
        @MessageBody("id") id: string,
        @ConnectedSocket() client: SocketWIthHandshake) {            
        this.activeUsers.push(id);
        const update = this.service.updateUserStatus(id, true, true)
        client.join(id?.toString());
        client.handshake.id = id;
        client.handshake.active = true;
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
        let alreadyMessaged: boolean = this.allMessages.filter(message => message.between.every(elem => [from, to].indexOf(elem) > -1))[0];
        console.log(this.allMessages.filter(message => message.between.every(elem => [from, to].indexOf(elem) > -1))[0]);   

        let messageData = {};

        if (alreadyMessaged) {
            const previousMessaging = this.allMessages.filter(e => (e.between?.includes(from) && e.between?.includes(to)))[0] || {};
            console.log({previousMessaging});
            delete this.allMessages[this.allMessages.indexOf(previousMessaging)]
            messageData = {
                between: previousMessaging.between || [from, to],
                messages: [...previousMessaging.messages || [message], message],
                sequence: [...previousMessaging.sequence || [0], previousMessaging.between?.indexOf(from)],
                lastDate: new Date().toString().slice(0, 10),
            }
        }
        else {
            messageData = {
                between: [from, to],
                sequence: [0],
                messages: [message],
                lastDate: new Date().toString().slice(0, 10),
            }
        }
        this.allMessages.push(
            {
                ...messageData,
            }
        );
        this.server.sockets.in(to.toString()).emit("message", messageData);
        console.log({messageData});
        
        return messageData;
    }

    @SubscribeMessage("getMessages")
    async handleGetMessages(@MessageBody("interlocuters") interlocuters: number[]) {
        return await this.allMessages.filter(messages => messages.between?.every(id => interlocuters.indexOf(id) > -1))[0];
     }
}

export default WebSocketsGateway;