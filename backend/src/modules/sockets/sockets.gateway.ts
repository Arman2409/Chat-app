import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage, MessageBody, ConnectedSocket
} from "@nestjs/websockets";
import {Server} from "socket.io";
import {remove} from "lodash"

import type {SocketWIthHandshake} from "../../../types/types";
import type { MessageType, MessagesType } from "../../../types/graphqlTypes";
import {SocketsService} from "./sockets.service";

@WebSocketGateway({ cors: "*" })
export class WebSocketsGateway implements OnGatewayInit, OnGatewayDisconnect, OnGatewayConnection {
    @WebSocketServer() server: Server;

    constructor(private readonly service: SocketsService) {}

    private activeUsers: string[] = [];

    private allMessages = [];

    async afterInit() {
        const messages = await this.service.getMessages();
        this.allMessages = messages;
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
            return "Signed In";
        } else {
            return "Not Connected";
        }
    };

    @SubscribeMessage("message")
    async handleMessage(
        @MessageBody("from") from: string,
        @MessageBody("to") to: string,
        @MessageBody("message") messageText: string,
        @MessageBody("file") file: string,
        @MessageBody("audio") audio: string,
        @MessageBody("orgFile") originalFile: string,
    ) {
        
        let messageData:MessagesType = {} as MessagesType;
        console.log(this.allMessages);
        
        let previousMessaging:MessagesType = this.allMessages.filter(e => (e.between?.includes(from) && e.between?.includes(to)))[0] || null;
        const message: MessageType = {
            text: messageText,
            file: file && {
                originalName: originalFile,
                name: file
                 },
            audio: audio && audio,
            date:  new Date().toString().slice(3, 21),
            sentBy: previousMessaging ? previousMessaging?.between?.indexOf(from) : 0,
        }
        if (previousMessaging) {
            if(previousMessaging.blocked) {
                return previousMessaging;
            }
            remove(this.allMessages,(messages) => {
                return messages === previousMessaging;
            });
            messageData = {
                between: previousMessaging.between || [from, to],
                messages: [...previousMessaging.messages || [], message],
            }
        }
        else {
            messageData = {
                between: [from, to],
                messages: [message],
            }
        }
        messageData =  {
            ...messageData,
            notSeen:
                    {
                        count: previousMessaging?.notSeen?.count + 1 || 1,
                        by: messageData?.between?.indexOf(to)
                    }
         }
        this.allMessages.push(messageData);
        this.server.sockets.in(to).emit("message", messageData);
        await  this.service.updateMessages(this.allMessages);
        return messageData;
    }

    @SubscribeMessage("getInterlocutor")
    async handleNewInterlocuter(@MessageBody("currentId") currentId: string, @MessageBody("userId") userId: string) {
        const messaged = this.allMessages.filter(messages => messages.between.includes(currentId) && messages.between.includes(userId));
        if (messaged?.length){
            const previousMessaging = messaged[0];
            let updated = false;
            if (previousMessaging.notSeen?.by === previousMessaging?.between?.indexOf(currentId)) {
                remove(this.allMessages,(messages) => {
                    return messages.between?.includes(currentId) && messages.between?.includes(userId);
                });
                
                updated = previousMessaging.notSeen.count !== 0;
                previousMessaging.notSeen.by = 0;
                previousMessaging.notSeen.count = 0;
                this.allMessages.push(previousMessaging); 
                await this.service.updateMessages(this.allMessages);
            }
            return {
                 ...previousMessaging,
                  updated
                };
        } else {
            return "Not messaged";
        }
    }
    
     @SubscribeMessage("blockUser")
     async blockUser(@MessageBody("by") by: string,
        @MessageBody("user") user: string,){
        const addBlocked = await this.service.addRemoveBlockedUser(by, user, "block");
        if(addBlocked) {
          return addBlocked;
        } else {
            return "Not blocked";
        }
     }

     @SubscribeMessage("unBlockUser")
     async unBlockUser(@MessageBody("by") by: string,
        @MessageBody("user") user: string,){
        const removeBlocked = await this.service.addRemoveBlockedUser(by, user, "unblock");
        if(removeBlocked) {
         return removeBlocked;
        } else {
            return "Not unblocked";
        }
     }

     @SubscribeMessage("getNotSeenCount")
     async getNotSeenCount(
        @ConnectedSocket() client: SocketWIthHandshake
     ) {
         const id = client.handshake.id;
         const notSeenCount = this.service.getNotSeenCount(this.allMessages, id);
         return {notSeenCount};
     }
}

export default WebSocketsGateway;