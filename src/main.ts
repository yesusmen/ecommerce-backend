import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { join } from 'path/win32';
import { NestExpressApplication } from '@nestjs/platform-express';


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const publicPath = join(__dirname, '..', 'public');
  app.useStaticAssets(publicPath);
  app.useGlobalPipes(new ValidationPipe());
  dotenv.config();
  await app.listen(process.env.PORT || 3000, process.env.HOST || 'localhost');
}
bootstrap();
