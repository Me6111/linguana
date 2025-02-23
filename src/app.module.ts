// src/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module'; // Correct import

@Module({
  imports: [DatabaseModule], // Import the DatabaseModule here
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}