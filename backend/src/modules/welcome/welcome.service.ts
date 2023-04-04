import { Injectable } from '@nestjs/common';
import {PrismaService} from "nestjs-prisma";

@Injectable()
export class WelcomeService {
    constructor(private readonly  prisma: PrismaService) {}
    async getNews():Promise<any> {
        return await this.prisma.news.findMany();
    }
}
