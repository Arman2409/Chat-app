import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'nestjs-prisma';
import { randomBytes } from 'crypto';

import { SearchService } from './search.service';

describe('SearchService', () => {
  let service: SearchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SearchService, PrismaService],
    }).compile();

    service = module.get<SearchService>(SearchService);
  });

  it('findUserById should return null or object',async () => {
    const randomId = randomBytes(12).toString("hex");
    const returnValue = await service.findUserById(randomId);
    const hasFound = returnValue === null || returnValue instanceof Object;
    expect(hasFound).toBe(true);
  });
});
