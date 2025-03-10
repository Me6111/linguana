// src/entities/nouns/nouns.repository.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Nouns } from './nouns.entity'; // Assuming you have a Noun entity

@Injectable()
export class NounsRepository {
  constructor(
    @InjectRepository(Nouns)
    private nounsRepository: Repository<Nouns>,
  ) {}

  // Add your repository methods here (e.g., find, create, update, delete)
  async findAll(): Promise<Nouns[]> {
    return this.nounsRepository.find();
  }

    async create(noun: Partial<Nouns>): Promise<Nouns> {
        return this.nounsRepository.save(noun);
    }
  // ... other methods
}