import { Injectable, Logger } from '@nestjs/common';
import { AdjectivesRepository } from '../entities/adjectives/adjectives.repository';
import { NounsRepository } from '../entities/nouns/nouns.repository';

@Injectable()
export class SyncService {
  private readonly logger = new Logger(SyncService.name);

  constructor(
    private adjectiveRepository: AdjectivesRepository,
    private nounRepository: NounsRepository,
  ) {}

  async getUpdates(lastSyncTime: string, lastSyncVersion: number) {
    try {
      const adjectiveUpdates = await this.adjectiveRepository.findAll(); // Example usage, adjust to your needs
      const nounUpdates = await this.nounRepository.findAll(); // Example usage, adjust to your needs

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