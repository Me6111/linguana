// src/entities/adjectives/adjectives.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdjectiveController } from './adjectives.controller';
import { AdjectivesService } from './adjectives.service';
import { Adjectives } from './adjectives.entity';
import { AdjectivesRepository } from './adjectives.repository'; // Import the repository

@Module({
  imports: [TypeOrmModule.forFeature([Adjectives])],
  controllers: [AdjectiveController],
  providers: [AdjectivesService, AdjectivesRepository], // Provide the repository
  exports: [AdjectivesRepository], // Export the repository
})
export class AdjectivesModule {}