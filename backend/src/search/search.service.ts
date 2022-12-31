import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class SearchService {
    constructor(private readonly prisma: PrismaService){}

    async searchInAll(name:string, page:number, perPage: number) {
        let data:any = await this.prisma.user.findMany({
            where: {
                name: name
            }
        });
         
        const total = data.length / perPage;
        const startIndex = page * perPage - perPage;
        const endIndex = page * perPage
        data = data.splice(startIndex, endIndex);
        
        return {users: data, total};
    }
}
