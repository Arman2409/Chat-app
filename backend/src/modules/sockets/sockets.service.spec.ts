import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'nestjs-prisma';

import { SocketsService } from './sockets.service';

describe('SocketsService', () => {
  let service: SocketsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SocketsService, PrismaService],
    }).compile();

    service = module.get<SocketsService>(SocketsService);
  });

  it('should be function', async () => {
    expect(service.addRemoveBlockedUser).toBeInstanceOf(Function);
  });
});
