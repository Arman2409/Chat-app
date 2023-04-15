import { Injectable } from '@nestjs/common';
import {PrismaService} from "nestjs-prisma";
import { MessageType } from 'types/graphqlTypes';

@Injectable()
export class SocketsService {
    constructor(private readonly prisma:PrismaService) {}

    async updateUserStatus(id:string, status:boolean, lastVisited?:boolean):Promise<any> {
        if (lastVisited) {
            return  await this.prisma.users.update({
                where : { id },
                data: {
                    active: status,
                    lastVisited: new Date().toString().slice(0,10)
                }
            });
        }
        return  await this.prisma.users.update({
            where : { id },
            data: {
                active: status,
            }
        });
    }

    async updateMessages(allMessages: MessageType[]) {
        await this.prisma.messages.deleteMany();
        if (allMessages.length) {
           await this.prisma.messages.createMany({ data: allMessages as any });
        };
    }

}
