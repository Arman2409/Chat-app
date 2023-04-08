import { Module } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { RequestContextModule} from "nestjs-request-context"

import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { JwtService } from '../../middlewares/jwt/jwt.service';
import { CloudinaryService } from 'src/middlewares/cloudinary/cloudinary.service';


@Module({
    providers: [AuthResolver, CloudinaryService,  PrismaService, AuthService, JwtService],
    imports: [RequestContextModule]
})
export class AuthModule {}
