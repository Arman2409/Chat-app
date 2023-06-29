import { PrismaService } from "nestjs-prisma";
import { MessagesType } from '../../../types/graphqlTypes';
export declare class SocketsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    updateUserStatus(id: string, status: boolean, lastVisited?: boolean): Promise<any>;
    updateMessages(allMessages: MessagesType[]): Promise<void>;
    getMessages(): Promise<any[]>;
    addRemoveBlockedUser(byId: string, userId: string, type: string): Promise<any>;
    getNotSeenCount(messages: any[], id: string): number;
}
