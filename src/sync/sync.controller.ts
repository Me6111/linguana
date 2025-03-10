import { Controller, Get, Query } from '@nestjs/common';
import { SyncService } from './sync.service';

@Controller('sync')
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  @Get()
  async getUpdates(
    @Query('lastSyncTime') lastSyncTime: string,
    @Query('lastSyncVersion') lastSyncVersion: number,
  ) {
    return this.syncService.getUpdates(lastSyncTime, lastSyncVersion);
  }
}