import { NestFactory } from '@nestjs/core';
import { parse } from 'path';
import * as session from "express-session"
import * as express from "express";
import * as bodyParser from "body-parser";

import { AppModule } from './app.module';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);

  // Middlewares 
  app.use(bodyParser.json({limit: '50mb'}));
  app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
  app.use(bodyParser.text({ limit: '200mb' }));
  app.use((req:Request, res:Response, next:Function) => {
    console.log(req.url);
    console.log(req.body);
     next();
  });
  app.setGlobalPrefix("api");
  app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  }));
  await app.listen(process.env.PORT);
}
bootstrap();
