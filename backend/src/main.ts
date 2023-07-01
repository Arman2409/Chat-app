import { NestFactory } from '@nestjs/core';
import * as session from "express-session"
import * as bodyParser from "body-parser";

import { AppModule } from './app.module';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);

  // Middlewares 
  app.use(bodyParser.json({limit: '50mb'}));
  app.use((req:any, res:any, next:any) => {
    console.log(req.body);
    next();
  })
  app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
  app.use(bodyParser.text({ limit: '200mb' }));
  app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  }));
  await app.listen(process.env.PORT);
}
bootstrap();

export default bootstrap;
