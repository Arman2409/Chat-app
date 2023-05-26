import { PrismaService } from "nestjs-prisma";
import { MessageType } from 'types/graphqlTypes';
export declare class SocketsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    updateUserStatus(id: string, status: boolean, lastVisited?: boolean): Promise<any>;
    updateMessages(allMessages: MessageType[]): Promise<void>;
    getMessages(): Promise<import(".prisma/client").Messages[]>;
}
