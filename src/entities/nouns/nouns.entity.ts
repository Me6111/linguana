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



    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;
  
    @Column({ type: 'int', default: 1 })
    version: number;
}