import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm'; // Import MoreThan
import { Migration } from '../migration/migration.entity';

@Injectable()
export class SyncService {
  private readonly logger = new Logger(SyncService.name);

  constructor(
    @InjectRepository(Migration)
    private migrationRepository: Repository<Migration>,
  ) {}

  async getUpdates(lastMigrationId: number) {
    try {
      this.logger.log(`Sync request received with lastMigrationId: ${lastMigrationId}`);

      const migrationUpdates = await this.migrationRepository.find({
        where: {
          id: lastMigrationId ? MoreThan(lastMigrationId) : MoreThan(0), // Use MoreThan operator
        },
        order: { id: 'ASC' },
      });

      this.logger.log(
        `Sync: Found ${migrationUpdates.length} migration updates.`,
      );

      return migrationUpdates;
    } catch (error) {
      this.logger.error(`Sync error: ${error.message}`, error.stack);

      return {
        error: error.message,
      };
    }
  }
}