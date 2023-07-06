import { PrismaService } from 'nestjs-prisma';
export declare class MessagesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getLastMessages(ctx: any, page: number, perPage: number): Promise<{
        total: number;
        users: Promise<{
            lastMessage: any;
            notSeenCount: any;
            password: string;
            id: string;
            name: string;
            email: string;
            image: string;
            friends: string[];
            active: boolean;
            friendRequests: string[];
            sentRequests: string[];
            lastVisited: string;
            blockedUsers: string[];
            lastMesage: string;
        }>[];
    }>;
}
