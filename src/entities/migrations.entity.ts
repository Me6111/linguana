import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('migrations')
export class Migrations {
  @PrimaryColumn()
  id: number;

  @Column({ type: 'bigint' })
  timestamp: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true }) // Added sql column
  sql: string;
}