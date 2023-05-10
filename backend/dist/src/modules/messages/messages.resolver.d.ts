import { MessagesService } from "./messages.service";
export declare class MessagesResolver {
    private readonly service;
    constructor(service: MessagesService);
    lastMessages(ctx: any, page: number, perPage: number): Promise<{
        total: any;
        users: any;
    }>;
}
