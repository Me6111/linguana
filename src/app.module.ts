// src/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AdjectivesModule } from './entities/adjectives/adjectives.module';
import { NounsModule } from './entities/nouns/nouns.module';
import { SyncController } from './sync/sync.controller';
import { SyncService } from './sync/sync.service';
import { AdjectivesRepository } from './entities/adjectives/adjectives.repository'; // Import AdjectivesRepository
import { NounsRepository } from './entities/nouns/nouns.repository'; // Import NounsRepository

@Module({
  imports: [DatabaseModule, AdjectivesModule, NounsModule],
  controllers: [AppController, SyncController],
  providers: [AppService, SyncService, AdjectivesRepository, NounsRepository], // Add AdjectivesRepository and NounsRepository
})
export class AppModule {}