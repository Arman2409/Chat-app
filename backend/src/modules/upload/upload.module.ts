import { Module } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

import { UploadResolver } from './upload.resolver';
import { UploadService } from './upload.service';

@Module({
  providers: [UploadResolver, PrismaService, UploadService]
})
export class UploadModule {}
