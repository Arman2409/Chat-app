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

import {SocketWIthHandshake} from "../../../types/types";
import {SocketsService} from "./sockets.service";
import { MessageType } from "../../../types/graphqlTypes";

@WebSocketGateway({ cors: "*" },)
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

    @SubscribeMessage("getNotSeenCount")
    async getNotSeenCount(
        @MessageBody("id") id: string,
    ){
        const notSeenCount = this.allMessages.filter(message => {
            const notSeenByUser = message?.notSeen?.by === message.between?.indexOf(id);
            if(notSeenByUser) {
              return  message?.notSeen?.count > 0;
            } else {
              return false;
            }
          })
        return {notSeenCount: notSeenCount?.length};
    }

    @SubscribeMessage("message")
    async handleMessage(@MessageBody("from") from: string,
        @MessageBody("to") to: string,
        @MessageBody("message") message: string,
    ) {
        let alreadyMessaged = this.allMessages.filter(message => message.between.every((elem:string) => [from, to].indexOf(elem) > -1))[0];
        let messageData:MessageType = {} as MessageType;
        let previousMessaging:MessageType;
        
        if (alreadyMessaged) {
            previousMessaging = this.allMessages.filter(e => (e.between?.includes(from) && e.between?.includes(to)))[0] || {};
            if(previousMessaging.blocked) {
                return previousMessaging;
            }
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
        messageData =  {
            ...messageData,
            notSeen:
                    {
                        count: previousMessaging?.notSeen.count + 1 || 1,
                        by: messageData?.between?.indexOf(to)
                    }
         }
        this.allMessages.push(messageData);
        this.server.sockets.in(to).emit("message", messageData);
        await  this.service.updateMessages(this.allMessages);
        return messageData;
    }

    @SubscribeMessage("newInterlocutor")
    async handleNewInterlocuter(@MessageBody("id") currentId: string, @MessageBody("userId") userId: string) {
        const messaged = this.allMessages.filter(messages => messages.between.includes(currentId) && messages.between.includes(userId));
        
        if (messaged?.length){
            const previousMessaging = messaged[0];
            if (previousMessaging.notSeen?.by === previousMessaging?.between?.indexOf(currentId)) {
                remove(this.allMessages,(messages) => {
                    return messages.between?.includes(currentId) && messages.between?.includes(userId);
                });
                
                previousMessaging.notSeen.by = 0;
                previousMessaging.notSeen.count = 0;
                this.allMessages.push(previousMessaging); 
                await this.service.updateMessages(this.allMessages);
            }

            return previousMessaging;
        } else {
            return "Not messaged";
        }
    }

    @SubscribeMessage("getMessages")
    async handleGetMessages(@MessageBody("interlocuters") interlocuters: string[]) {
        return await this.allMessages.filter(messages => messages.between?.every((id:string) => interlocuters.indexOf(id) > -1))[0];
     }

     @SubscribeMessage("blockUser")
     async blockUser(@MessageBody("by") by: string,
        @MessageBody("user") user: string,){
            
        const messaged = this.allMessages.filter(messages => messages.between.includes(by) && messages.between.includes(user));
        let messageData:any;
        if (messaged?.length){
            messageData = messaged[0];
            if(messageData.blocked) {
                return "Already blocked";
            }
            remove(this.allMessages,(messages) => {
                return messages === messageData;
            });
            messageData.blocked = true;
            messageData.blockedBy = messageData.between?.indexOf(by);
        } else {
           messageData  =  {
            between: [by, user],
            blocked: true,
            sequence: [],
            messages: [],
            notSeen:  {
                count:0,
                by:0
            },
            blockedBy: 0,
            lastDate: new Date().toString().slice(0, 10),
          }
        }
        this.allMessages.push(messageData);
        await this.service.updateMessages(this.allMessages);
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
            
        const messaged = this.allMessages.filter(messages => messages.between.includes(by) && messages.between.includes(user));
        let messageData:any;
        if (messaged?.length){
            messageData = messaged[0];
            remove(this.allMessages,(messages) => {
                return messages === messageData;
            });
            messageData.blocked = false;
            messageData.blockedBy = 0;
        }
        this.allMessages.push(messageData);
        await  this.service.updateMessages(this.allMessages);
        const removeBlocked = await this.service.addRemoveBlockedUser(by, user, "unblock");
        if(removeBlocked) {
         return removeBlocked;
        } else {
            return "Not unblocked";
        }
     }
}

export default WebSocketsGateway;