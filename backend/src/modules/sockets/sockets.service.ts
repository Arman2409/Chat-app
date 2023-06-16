import { Injectable } from '@nestjs/common';
import { GraphQLError } from 'graphql';
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
        if (allMessages.length) {
            await this.prisma.messages.deleteMany().then(async () => {
                await this.prisma.messages.createMany({ data: allMessages as any });            
            });
        };
    };

    async getMessages():Promise<any[]> {
        return await this.prisma.messages.findMany();
    }
    
    async addRemoveBlockedUser(byId:string, userId:string, type:string):Promise<any> {
        const byUser =  await this.prisma.users.findUnique(
            {
                where: {
                    id: byId
                }
            });
        if(!byUser) {
            throw new GraphQLError("User not found");
        };
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