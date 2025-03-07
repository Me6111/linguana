// src/entities/nouns.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Nouns {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    sense: string;

    @Column()
    en: string;

    @Column()
    es: string;
}