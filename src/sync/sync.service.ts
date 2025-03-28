import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { Migrations } from '../entities/migrations.entity'; // Corrected entity name

@Injectable()
export class SyncService {
  private readonly logger = new Logger(SyncService.name);

  constructor(
    @InjectRepository(Migrations) // Corrected repository type
    private migrationsRepository: Repository<Migrations>,
  ) {}

  async getUpdates(lastMigrationId: number) {
    try {
      this.logger.log(`Sync request received with lastMigrationId: ${lastMigrationId}`);

      const migrationUpdates = await this.migrationsRepository.find({ // Corrected repository usage
        where: {
          id: lastMigrationId ? MoreThan(lastMigrationId) : MoreThan(0),
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