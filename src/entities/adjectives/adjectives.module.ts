// src/entities/adjectives/adjectives.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Adjectives } from './adjectives.entity';
import { AdjectivesService } from './adjectives.service';
import { AdjectivesController } from './adjectives.controller';
import { AdjectivesRepository } from './adjectives.repository'; // Import the repository

@Module({
  imports: [TypeOrmModule.forFeature([Adjectives])],
  controllers: [AdjectivesController],
  providers: [AdjectivesService, AdjectivesRepository], // Provide the repository
  exports: [AdjectivesRepository] // Export the repository
})
export class AdjectivesModule {}