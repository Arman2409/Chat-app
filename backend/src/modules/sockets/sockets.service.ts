import { Injectable } from '@nestjs/common';
import {PrismaService} from "nestjs-prisma";

@Injectable()
export class SocketsService {
    constructor(private readonly prisma:PrismaService) {}

    async updateUserStatus(id:number, status:boolean, lastVisited?:boolean) {
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

}
