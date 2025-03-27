import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Adjectives } from '../entities/adjectives/adjectives.entity';
import { Nouns } from '../entities/nouns/nouns.entity';

@Injectable()
export class SyncService {
  private readonly logger = new Logger(SyncService.name);

  constructor(
    @InjectRepository(Adjectives)
    private adjectiveRepository: Repository<Adjectives>,
    @InjectRepository(Nouns)
    private nounRepository: Repository<Nouns>,
  ) {}

  async getUpdates(lastSyncTime: string, lastSyncVersion: number) {
    try {
      const adjectiveUpdates = await this.adjectiveRepository.find({
        where: [
          { updatedAt: new Date(lastSyncTime) },
          { version: lastSyncVersion + 1 },
        ],
        order: { updatedAt: 'ASC', version: 'ASC' },
      });

      const nounUpdates = await this.nounRepository.find({
        where: [
          { updatedAt: new Date(lastSyncTime) },
          { version: lastSyncVersion + 1 },
        ],
        order: { updatedAt: 'ASC', version: 'ASC' },
      });

      this.logger.log(
        `Sync: Found ${adjectiveUpdates.length} adjective updates and ${nounUpdates.length} noun updates.`,
      );

      return {
        adjectives: adjectiveUpdates,
        nouns: nounUpdates,
      };
    } catch (error) {
      this.logger.error(`Sync error: ${error.message}`, error.stack);

      // Send schema information on error
      const adjectiveSchema = await this.adjectiveRepository.metadata;
      const nounSchema = await this.nounRepository.metadata;

      return {
        error: error.message,
        schema: {
          adjectives: {
            name: adjectiveSchema.tableName,
            columns: adjectiveSchema.columns.map(col => ({
              name: col.propertyName,
              type: col.type,
              isPrimary: col.isPrimary,
            })),
          },
          nouns: {
            name: nounSchema.tableName,
            columns: nounSchema.columns.map(col => ({
              name: col.propertyName,
              type: col.type,
              isPrimary: col.isPrimary,
            })),
          },
        },
      };
    }
  }
}