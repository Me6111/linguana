// src/entities/adjectives/adjectives.repository.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Adjectives } from './adjectives.entity'; // Assuming you have an Adjective entity

@Injectable()
export class AdjectivesRepository {
  constructor(
    @InjectRepository(Adjectives)
    private adjectivesRepository: Repository<Adjectives>,
  ) {}

  // Add your repository methods here (e.g., find, create, update, delete)
  async findAll(): Promise<Adjectives[]> {
    return this.adjectivesRepository.find();
  }

  async create(adjective: Partial<Adjectives>): Promise<Adjectives> {
    return this.adjectivesRepository.save(adjective);
  }

  // ... other methods
}