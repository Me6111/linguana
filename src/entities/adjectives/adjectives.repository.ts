// src/entities/adjectives/adjectives.repository.ts

import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Adjectives } from './adjectives.entity';

@Injectable()
export class AdjectivesRepository extends Repository<Adjectives> {
  constructor(private dataSource: DataSource) {
    super(Adjectives, dataSource.createEntityManager());
  }
}