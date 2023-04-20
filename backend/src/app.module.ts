import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig,} from "@nestjs/apollo";
import { PrismaService } from "nestjs-prisma"
import { join } from 'path';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

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
        // template: {
        //   dir: join(__dirname, './templates'),
        //   adapter: new HandlebarsAdapter(),
        //   options: {
        //     strict: true
        //   }
        // }
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
