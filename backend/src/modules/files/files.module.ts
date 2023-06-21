import { Module } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

import { FilesResolver } from './files.resolver';
import { FilesService } from './files.service';

@Module({
  providers: [FilesResolver, PrismaService, FilesService]
})
export class FilesModule {}
