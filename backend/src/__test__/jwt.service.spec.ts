import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '../middlewares/jwt/jwt.service';
import { ConfigModule } from '@nestjs/config';

describe('JwtService', () => {
  let service: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtService],
      imports: [ConfigModule.forRoot()]
    }).compile();

    service = module.get<JwtService>(JwtService);
  });

  it('should create token from object and then authenticate signed token',async () => {
    const testObject = {
      name: "object",
      for: "testing"
    }
    const token = service.sign(testObject);
    expect(typeof token).toBe("string");
    const object = service.authenticate(token);
    expect(object).toBeInstanceOf(Object);
  });
});
