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
import { MessageType } from "types/graphqlTypes";

@WebSocketGateway({ cors: "*" },)
export class WebSocketsGateway implements OnGatewayInit, OnGatewayDisconnect, OnGatewayConnection {
    @WebSocketServer() server: Server;

    constructor(private readonly service: SocketsService) {}

    private activeUsers: string[] = [];

    private allMessages = [];

    private previousAllMessages = [];

    afterInit(): any {
        setInterval( async () => {           
            if (!isEqual(this.allMessages, this.previousAllMessages)) {
                 await this.service.updateMessages(this.allMessages);
                 this.previousAllMessages = [...this.allMessages];
            }
        }, 500);
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
        let messageData:MessageType = {} as MessageType;

        let previousMessaging:MessageType;

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
                    notSeen:
                    {
                        count:0,
                        by:0
                    }
                }
            );
        }
        else {
            this.allMessages.push(
                {
                    ...messageData,
                    notSeen:
                            {
                                count: previousMessaging?.notSeen.count + 1 || 1,
                                by: messageData?.between?.indexOf(to)
                            }
                }
            );
        };
        this.server.sockets.in(to).emit("message", messageData);
        return messageData;
    }

    @SubscribeMessage("newInterlocutor")
    async handleNewInterlocuter(@MessageBody("id") currentId: string, @MessageBody("userId") userId: string) {
        const messaged = this.allMessages.filter(messages => messages.between.includes(currentId) && messages.between.includes(userId));
        
        if (messaged?.length){
            const previousMessaging = messaged[0];
            if (previousMessaging.notSeen?.by === previousMessaging?.between?.indexOf(currentId)) {
                remove(this.allMessages,(messages) => {
                    console.log(messages === previousMessaging);
                    
                    return messages === previousMessaging;
                });
                previousMessaging.notSeen.count = 0;
                this.allMessages.push(previousMessaging);
                return "new interlocuter got";
            }
        } else {
            return "Not messaged";
        }
    }

    @SubscribeMessage("getMessages")
    async handleGetMessages(@MessageBody("interlocuters") interlocuters: string[]) {
        return await this.allMessages.filter(messages => messages.between?.every((id:string) => interlocuters.indexOf(id) > -1))[0];
     }
}

export default WebSocketsGateway;