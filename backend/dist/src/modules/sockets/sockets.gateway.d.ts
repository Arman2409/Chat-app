import { OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from "@nestjs/websockets";
import { Server } from "socket.io";
import { SocketWIthHandshake } from "../../../types/types";
import { SocketsService } from "./sockets.service";
import { MessageType } from "types/graphqlTypes";
export declare class WebSocketsGateway implements OnGatewayInit, OnGatewayDisconnect, OnGatewayConnection {
    private readonly service;
    server: Server;
    constructor(service: SocketsService);
    private activeUsers;
    private allMessages;
    private previousAllMessages;
    afterInit(): Promise<any>;
    handleConnection(): any;
    handleDisconnect(client: SocketWIthHandshake): Promise<any>;
    handleConnect(id: string, client: SocketWIthHandshake): Promise<"Not Connected" | {
        notSeenCount: number;
    }>;
    handleMessage(from: string, to: string, message: string): MessageType;
    handleNewInterlocuter(currentId: string, userId: string): Promise<"Got new interlocuter" | "Not messaged">;
    handleGetMessages(interlocuters: string[]): Promise<any>;
}
export default WebSocketsGateway;
