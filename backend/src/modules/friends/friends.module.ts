import { Module } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { FriendsResolver } from './friends.resolver';
import { FriendsService } from './friends.service';
import { JwtService } from "../../services/jwt/jwt.service";

@Module({
  providers: [FriendsService, PrismaService, FriendsResolver, JwtService]
})
export class FriendsModule {}
