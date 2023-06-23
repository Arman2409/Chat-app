import { PrismaService } from 'nestjs-prisma';
import { MailerService } from '@nestjs-modules/mailer';
import { UserType } from '../../../types/graphqlTypes';
import { JwtService } from "../../middlewares/jwt/jwt.service";
import { CloudinaryService } from '../../middlewares/cloudinary/cloudinary.service';
export declare class AuthService {
    private readonly prisma;
    private readonly jwt;
    private readonly mailerService;
    private readonly cloudinary;
    constructor(prisma: PrismaService, jwt: JwtService, mailerService: MailerService, cloudinary: CloudinaryService);
    addUser(user: Omit<UserType, "active">): Promise<any>;
    findUser(ctx: any, user: Omit<UserType, "active" | "name">): Promise<any>;
    setSession(ctx: any, token: string): Promise<any>;
    signOut(ctx: any): string;
    recoverEmail(email: string): Promise<any>;
    confirmNewPassword(id: string, newPassword: string): Promise<{
        successMessage: string;
    } | {
        message: string;
    }>;
}
