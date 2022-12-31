import { Module } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { SearchResolver } from './search.resolver';
import { SearchService } from './search.service';

@Module({
    imports: [],
    providers: [PrismaService, SearchService, SearchResolver]
})

export class SearchModule {}
