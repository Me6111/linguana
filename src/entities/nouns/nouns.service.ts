// src/nouns/nouns.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Nouns } from './nouns.entity';

@Injectable()
export class NounsService {
  constructor(
    @InjectRepository(Nouns)
    private nounsRepository: Repository<Nouns>,
  ) {}

  async create(nounData: Partial<Nouns>): Promise<Nouns> {
    const newNoun = this.nounsRepository.create(nounData);
    return this.nounsRepository.save(newNoun);
  }

  async update(
    id: number,
    nounData: Partial<Nouns>,
  ): Promise<Nouns | undefined> {
    await this.nounsRepository.update(id, nounData);
    const updatedNoun = await this.nounsRepository.findOneBy({ id });
    return updatedNoun ? updatedNoun : undefined;
  }

  async delete(id: number): Promise<void> {
    await this.nounsRepository.delete(id);
  }

  async findAll(): Promise<Nouns[]> {
    return this.nounsRepository.find();
  }

  async findOne(id: number): Promise<Nouns | undefined> {
    const foundNoun = await this.nounsRepository.findOneBy({ id });
    return foundNoun ? foundNoun : undefined;
  }
}