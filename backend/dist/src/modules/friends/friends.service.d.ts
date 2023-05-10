import { PrismaService } from 'nestjs-prisma';
import { JwtService } from "../../middlewares/jwt/jwt.service";
export declare class FriendsService {
    private readonly prisma;
    private readonly jwt;
    constructor(prisma: PrismaService, jwt: JwtService);
    addFriend(ctx: any, id: any): Promise<any>;
    findRequestUsers(ctx: any): Promise<any>;
    confirmFriend(ctx: any, id: any): Promise<{
        token: any;
        message?: undefined;
    } | {
        message: string;
        token?: undefined;
    }>;
}
