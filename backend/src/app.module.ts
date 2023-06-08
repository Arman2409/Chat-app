import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig,} from "@nestjs/apollo";
import { PrismaService } from "nestjs-prisma"
import { MailerModule } from '@nestjs-modules/mailer';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { AuthModule } from './modules/auth/auth.module';
import { JwtService } from './middlewares/jwt/jwt.service';
import { CloudinaryService } from './middlewares/cloudinary/cloudinary.service';
import { SearchModule } from './modules/search/search.module';
import { FriendsModule } from './modules/friends/friends.module';
import { MessagesModule } from './modules/messages/messages.module';
import { SocketsModule } from './modules/sockets/sockets.module';
import { WelcomeModule } from './modules/welcome/welcome.module';

@Module({
  imports: [
     ConfigModule.forRoot(),
     GraphQLModule.forRoot<ApolloDriverConfig>({
      context: ({ req, res }) => ({ req, res }),
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      debug: false
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../../', 'frontend/out/'),
    }),
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
     AuthModule,
     SearchModule,
     FriendsModule,
     SocketsModule,
     MessagesModule,
     WelcomeModule],
     providers: [PrismaService, JwtService, CloudinaryService],
})
export class AppModule {}
