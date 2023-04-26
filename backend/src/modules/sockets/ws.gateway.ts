import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage, MessageBody, ConnectedSocket
} from "@nestjs/websockets";
import {Server} from "socket.io";
import {isEqual, remove} from "lodash"

import {SocketWIthHandshake} from "../../../types/types";
import {SocketsService} from "./sockets.service";
import { AnyCnameRecord } from "dns";

@WebSocketGateway({ cors: "*" },)
export class WebSocketsGateway implements OnGatewayInit, OnGatewayDisconnect, OnGatewayConnection {
    @WebSocketServer() server: Server;

    constructor( private readonly service: SocketsService) {
    }

    private activeUsers: string[] = [];

    private allMessages = [];

    private previousAllMessages = [];

    afterInit(): any {
        setInterval( async () => {
            if (!isEqual(this.allMessages, this.previousAllMessages)) {
                 await this.service.updateMessages(this.allMessages);
                 this.previousAllMessages = [...this.allMessages];
            }
        }, 2000);
    }

    handleConnection(): any {
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
    handleMessage(@MessageBody("from") from: string,
        @MessageBody("to") to: string,
        @MessageBody("message") message: string,
    ) {
        let alreadyMessaged = this.allMessages.filter(message => message.between.every((elem:string) => [from, to].indexOf(elem) > -1))[0];
        let messageData = {};

        let previousMessaging;
        if (alreadyMessaged) {
             previousMessaging = this.allMessages.filter(e => (e.between?.includes(from) && e.between?.includes(to)))[0] || {};
            remove(this.allMessages,(messages) => {
                return messages === previousMessaging;
            });
            
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
        if(this.activeUsers.includes(to)) {
            this.allMessages.push(
                {
                    ...messageData,
                }
            );
        }
        else {
            this.allMessages.push(
                {
                    ...messageData,
                    notSeenCount: previousMessaging?.notSeenCount + 1 || 1,
                }
            );
        }
        this.server.sockets.in(to).emit("message", messageData);

        return messageData;
    }

    @SubscribeMessage("getMessages")
    async handleGetMessages(@MessageBody("interlocuters") interlocuters: number[]) {
        return await this.allMessages.filter(messages => messages.between?.every(id => interlocuters.indexOf(id) > -1))[0];
     }
}

export default WebSocketsGateway;