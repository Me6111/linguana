import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SyncService } from './sync.service';
import { SyncController } from './sync.controller';
import { Migration } from '../migration/migration.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Migration])],
  providers: [SyncService],
  controllers: [SyncController],
})
export class SyncModule {}