import { NestFactory } from '@nestjs/core';
import { parse } from 'path';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use((req:Request, res:Response, next:Function) => {
     const parsed = parse(req.url);
     console.log(parsed.dir);
     next();
  })
  app.setGlobalPrefix("api")
  await app.listen(process.env.PORT);
}
bootstrap();
