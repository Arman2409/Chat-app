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

@Module({
  imports: [
     ConfigModule.forRoot(),
     GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      debug: false
    }),
     AuthModule,
     SearchModule,
     FriendsModule,
     MessagesModule,
     SocketsModule],
     providers: [PrismaService, JwtService, CloudinaryService],
})
export class AppModule {}
