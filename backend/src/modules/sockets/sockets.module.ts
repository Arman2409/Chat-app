import { Module } from '@nestjs/common';
import { SocketsService } from './sockets.service';

@Module({
  providers: [SocketsService]
})
export class SocketsModule {}
