import { PrismaService } from "nestjs-prisma";
export declare class WelcomeService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getNews(): Promise<any>;
}
