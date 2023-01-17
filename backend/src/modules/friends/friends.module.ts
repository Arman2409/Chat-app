import { Module } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { FriendsResolver } from './friends.resolver';
import { FriendsService } from './friends.service';

@Module({
  providers: [FriendsService, PrismaService, FriendsResolver]
})
export class FriendsModule {}
