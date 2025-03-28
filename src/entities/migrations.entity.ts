import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('migrations') // Corrected table name
export class Migrations { // Corrected entity name
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  sql: string;
}