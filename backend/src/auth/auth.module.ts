import { Module } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { JwtService } from './../jwt/jwt.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { RequestContextModule} from "nestjs-request-context"

@Module({
    providers: [AuthResolver, CloudinaryService,  PrismaService, AuthService, JwtService],
    controllers: [],
    imports: [RequestContextModule]
})
export class AuthModule {}
