// src/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AdjectivesModule } from './entities/adjectives/adjectives.module';
import { NounsModule } from './entities/nouns/nouns.module'; // Import NounsModule
import { SyncController } from './sync/sync.controller'; // Import SyncController
import { SyncService } from './sync/sync.service'; // Import SyncService

@Module({
  imports: [DatabaseModule, AdjectivesModule, NounsModule], // Import all modules
  controllers: [AppController, SyncController], // Add SyncController
  providers: [AppService, SyncService], // Add SyncService
})
export class AppModule {}