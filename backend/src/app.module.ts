import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig,} from "@nestjs/apollo";
import { PrismaService } from "nestjs-prisma"
import { join } from 'path';

import { AuthModule } from './auth/auth.module';
import { JwtService } from './jwt/jwt.service';
import { CloudinaryService } from './cloudinary/cloudinary.service';

@Module({
  imports: [
     ConfigModule.forRoot(),
     GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      debug: false
    }),
     AuthModule],
     providers: [PrismaService, JwtService, CloudinaryService],
})
export class AppModule {}
