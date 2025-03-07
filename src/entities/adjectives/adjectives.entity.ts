// src/entities/adjectives/adjectives.entity.ts

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Adjectives {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'sense of' })
  sense_of: string;

  @Column({ name: 'feature of' })
  feature_of: string;

  @Column()
  positive: string;

  @Column()
  negative: string;

  @Column()
  definition: string;

  @Column({ name: 'examples of phrases' })
  example_phrases: string;

}