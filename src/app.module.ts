// src/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AdjectivesModule } from './entities/adjectives/adjectives.module';
import { NounsModule } from './entities/nouns/nouns.module';
import { SyncController } from './sync/sync.controller';
import { SyncService } from './sync/sync.service';

@Module({
  imports: [DatabaseModule, AdjectivesModule, NounsModule],
  controllers: [AppController, SyncController],
  providers: [AppService, SyncService],
})
export class AppModule {}