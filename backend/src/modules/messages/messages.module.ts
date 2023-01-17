import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { PrismaService } from 'nestjs-prisma';
import { MessagesResolver } from './messages.resolver';

@Module({
    imports: [],
    providers: [MessagesService, MessagesResolver, PrismaService]
})
export class MessagesModule {}
