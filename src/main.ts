// src/main.ts

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv'; // Import dotenv correctly

async function bootstrap() {
  dotenv.config(); // Load environment variables

  const app = await NestFactory.create(AppModule);
  app.enableCors(); // Enable CORS
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();