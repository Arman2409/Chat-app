import { Module } from '@nestjs/common';
import { WelcomeService } from './welcome.service';
import {PrismaService} from "nestjs-prisma";
import {WelcomeResolver} from "./welcome.resolver";

@Module({
  providers: [WelcomeService, PrismaService, WelcomeResolver]
})
export class WelcomeModule {}
