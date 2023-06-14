import { Test, TestingModule } from '@nestjs/testing';
import { WelcomeService } from '../modules/welcome/welcome.service';
import { PrismaService } from 'nestjs-prisma';

describe('WelcomeService', () => {
  let service: WelcomeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WelcomeService, PrismaService ],
    }).compile();

    service = module.get<WelcomeService>(WelcomeService);
  });

  it('getNews should return array',async () => {
    const data = await service.getNews();
    const isReturnedArray = Array.isArray(data);
    expect(isReturnedArray).toBe(true);
  });
});
