// src/adjectives/adjectives.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Adjectives } from './adjectives.entity';

@Injectable()
export class AdjectivesService {
  constructor(
    @InjectRepository(Adjectives)
    private adjectivesRepository: Repository<Adjectives>,
  ) {}

  async create(adjectiveData: Partial<Adjectives>): Promise<Adjectives> {
    const newAdjective = this.adjectivesRepository.create(adjectiveData);
    return this.adjectivesRepository.save(newAdjective);
  }

  async update(
    id: number,
    adjectiveData: Partial<Adjectives>,
  ): Promise<Adjectives | undefined> {
    await this.adjectivesRepository.update(id, adjectiveData);
    const updatedAdjective = await this.adjectivesRepository.findOneBy({ id });
    return updatedAdjective ? updatedAdjective : undefined;
  }

  async delete(id: number): Promise<void> {
    await this.adjectivesRepository.delete(id);
  }

  async findAll(): Promise<Adjectives[]> {
    return this.adjectivesRepository.find();
  }

  async findOne(id: number): Promise<Adjectives | undefined> {
    const foundAdjective = await this.adjectivesRepository.findOneBy({ id });
    return foundAdjective ? foundAdjective : undefined;
  }
}