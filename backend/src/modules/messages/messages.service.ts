import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class MessagesService {
     constructor(private readonly prisma:PrismaService){}

     async lastMessages(page:number, perPage:number){
        return {data: [], total: 1};
     }
}
