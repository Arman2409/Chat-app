import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'nestjs-prisma';

import { MessagesService } from '../modules/messages/messages.service';
import { getTestContext } from '../functions/testFunctions';

describe('MessagesService', () => {
  let service: MessagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MessagesService, PrismaService],
    }).compile();

    service = module.get<MessagesService>(MessagesService);
  });

  it('getLastMessages should return object with users property', async () => {
    const testContext = getTestContext();
    const page = 1, perPage = 6; 
    const data = await service.getLastMessages(testContext, page, perPage);
    expect(data).toHaveProperty("users");
  });
});
