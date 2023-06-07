import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'nestjs-prisma';

import { FriendsService } from './friends.service';
import { JwtService } from '../../middlewares/jwt/jwt.service';
import { getTestContext } from '../../../src/functions/testFunctions';

describe('FriendsService', () => {
  let service: FriendsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FriendsService, PrismaService, JwtService],
    }).compile();

    service = module.get<FriendsService>(FriendsService);
  });

  it('findRequestUsers should return array', async () => {
    const testContext = getTestContext();
    const data = await service.findRequestUsers(testContext);   
    const returnedArray = Array.isArray(data);
    expect(returnedArray).toBe(true);
  });
});
