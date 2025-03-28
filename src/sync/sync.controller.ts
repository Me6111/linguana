import { Controller, Get, Query } from '@nestjs/common';
import { SyncService } from './sync.service';

@Controller('sync')
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  @Get()
  async getUpdates(@Query('lastMigrationId') lastMigrationId: number) {
    return this.syncService.getUpdates(lastMigrationId);
  }
}