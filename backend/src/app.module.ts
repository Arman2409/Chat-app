import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig,} from "@nestjs/apollo";
import { PrismaService } from "nestjs-prisma"
import { join } from 'path';

import { AuthModule } from './auth/auth.module';
import { JwtService } from './services/jwt/jwt.service';
import { CloudinaryService } from './services/cloudinary/cloudinary.service';
import { SearchModule } from './search/search.module';

@Module({
  imports: [
     ConfigModule.forRoot(),
     GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      debug: false
    }),
     AuthModule,
     SearchModule],
     providers: [PrismaService, JwtService, CloudinaryService],
})
export class AppModule {}
