import { PrismaService } from 'nestjs-prisma';
export declare class SearchService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    searchInAll(ctx: any, name: string, page: number, perPage: number): Promise<{
        users: any[];
        total: number;
    }>;
    searchInFriends(ctx: any, name: string, page: number, perPage: number): Promise<{
        users: any[];
        total: number;
        message?: undefined;
    } | {
        message: string;
        users?: undefined;
        total?: undefined;
    }>;
    findUserById(id: any): Promise<any>;
}
