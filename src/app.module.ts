// src/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AdjectivesModule } from './entities/adjectives/adjectives.module'; // Import AdjectivesModule

@Module({
  imports: [DatabaseModule, AdjectivesModule], // Import both modules
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}