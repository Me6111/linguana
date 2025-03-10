import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Adjectives } from '../entities/adjectives/adjectives.entity'; // Adjust path as needed
import { Nouns } from '../entities/nouns/nouns.entity'; // Adjust path as needed

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
      throw error;
    }
  }
}