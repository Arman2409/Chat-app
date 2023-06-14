import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'nestjs-prisma';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthService } from '../modules/auth/auth.service';
import { JwtService } from '../middlewares/jwt/jwt.service';
import { CloudinaryService } from '../middlewares/cloudinary/cloudinary.service';
import { getTestContext } from '../functions/testFunctions';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, CloudinaryService, PrismaService, JwtService],
      imports: [
        MailerModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: async (config: ConfigService) => ({
            transport: {
              host: process.env.EMAIL_HOST,
              secure: false,
              auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
              },
            },
            defaults: {
              from: 'talkSpace'
            },
          }),
          inject: [ConfigService]
         }),
      ]
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should return message if user was not found', async () => {
    const testContext = getTestContext();
    const testUser = {
      email: "test@test"
    }
    const data = await service.findUser(testContext, testUser);
    expect(data).toHaveProperty("message");
  });

  it('should return message if session user does not exist', async () => {
    const testContext = getTestContext();
    const testUser = {
      email: "test@test"
    }
    const token = new JwtService().sign(testUser);
    const data = await service.setSession(testContext, token);
    expect(data).toBeNull();
  });
});
