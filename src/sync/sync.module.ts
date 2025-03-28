import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SyncService } from './sync.service';
import { SyncController } from './sync.controller';
import { Migrations } from '../entities/migrations.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Migrations])],
  providers: [SyncService],
  controllers: [SyncController],
})
export class SyncModule {}