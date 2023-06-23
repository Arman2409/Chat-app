import { MessagesService } from "./messages.service";
export declare class MessagesResolver {
    private readonly service;
    constructor(service: MessagesService);
    getLastMessages(ctx: any, page: number, perPage: number): Promise<{
        total: number;
        users: Promise<{
            lastMessage: any;
            notSeenCount: any;
            id: string;
            email: string;
            name: string;
            password: string;
            image: string;
            friends: string[];
            active: boolean;
            friendRequests: string[];
            sentRequests: string[];
            lastVisited: string;
            lastMesage: string;
            blockedUsers: string[];
        }>[];
    }>;
}
