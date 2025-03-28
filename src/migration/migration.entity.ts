import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Migration {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  sql: string;
}