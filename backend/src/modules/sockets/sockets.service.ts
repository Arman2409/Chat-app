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
    
    async addRemoveBlockedUser(byId:string, userId:string, type:string):Promise<any> {
        const byUser =  await this.prisma.users.findUnique(
            {
                where: {
                    id: byId
                }
            })
        const blockedUsers = byUser.blockedUsers;
        if(type === "block") {
            blockedUsers.push(userId);
        } else if (type === "unblock") {
            const userIndex =  blockedUsers.indexOf(userId);
            blockedUsers.splice(userIndex, 1);
        }
        return  await this.prisma.users.update({
            where : { id: byId },
            data: {
                blockedUsers,
            }
        });
    }
}