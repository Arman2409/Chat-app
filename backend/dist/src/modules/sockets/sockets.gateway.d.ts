import { OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from "@nestjs/websockets";
import { Server } from "socket.io";
import type { SocketWIthHandshake } from "../../../types/types";
import type { MessagesType } from "../../../types/graphqlTypes";
import { SocketsService } from "./sockets.service";
export declare class WebSocketsGateway implements OnGatewayInit, OnGatewayDisconnect, OnGatewayConnection {
    private readonly service;
    server: Server;
    constructor(service: SocketsService);
    private activeUsers;
    private allMessages;
    afterInit(): Promise<void>;
    handleConnection(): any;
    handleDisconnect(client: SocketWIthHandshake): Promise<any>;
    handleConnect(id: string, client: SocketWIthHandshake): Promise<"Not Connected" | {
        notSeenCount: number;
    }>;
    handleMessage(from: string, to: string, messageText: string, file: string, audio: string, originalFile: string): Promise<MessagesType>;
    handleNewInterlocuter(currentId: string, userId: string): Promise<any>;
    blockUser(by: string, user: string): Promise<any>;
    unBlockUser(by: string, user: string): Promise<any>;
    getNotSeenCount(client: SocketWIthHandshake): Promise<{
        notSeenCount: number;
    }>;
}
export default WebSocketsGateway;
