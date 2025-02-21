// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module'; // Import DatabaseModule

@Module({
  imports: [ConfigModule.forRoot(), DatabaseModule], // Add DatabaseModule here!
  controllers: [AppController],
  providers: [AppService], // AppService is already here
})
export class AppModule {}