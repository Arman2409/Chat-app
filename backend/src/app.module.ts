import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig,} from "@nestjs/apollo";
import { PrismaService } from "nestjs-prisma"
import { join } from 'path';

import { AuthModule } from './modules/auth/auth.module';
import { JwtService } from './services/jwt/jwt.service';
import { CloudinaryService } from './services/cloudinary/cloudinary.service';
import { SearchModule } from './modules/search/search.module';
import { FriendsModule } from './modules/friends/friends.module';
import { MessagesModule } from './modules/messages/messages.module';
import { SocketsModule } from './modules/sockets/sockets.module';
// import { WebSocketsGateway } from "./modules/sockets/sockets.module";
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
     AuthModule,
     SearchModule,
     FriendsModule,
     SocketsModule,
     MessagesModule,
     WelcomeModule],
     providers: [PrismaService, JwtService, CloudinaryService],
})
export class AppModule {}
