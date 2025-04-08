import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

@Injectable()
export class SyncService {
  private readonly logger = new Logger(SyncService.name);

  constructor(@InjectConnection() private readonly connection: Connection) {}

  async getTableSchema(tableName: string): Promise<any[]> {
    try {
      const columns: any[] = await this.connection.query(
        `SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_KEY, COLUMN_DEFAULT
         FROM INFORMATION_SCHEMA.COLUMNS
         WHERE TABLE_NAME = ? AND TABLE_SCHEMA = ?
         ORDER BY ORDINAL_POSITION`,
        [tableName, this.connection.driver.database],
      );
      return columns;
    } catch (error) {
      this.logger.error(`Error fetching schema for table ${tableName}:`, error);
      return [];
    }
  }

  async getFullSchemaForRequiredTables(): Promise<Record<string, any[]>> {
    const requiredTables = ['adjectives', 'nouns'];
    const fullSchema: Record<string, any[]> = {};
    for (const tableName of requiredTables) {
      const schema = await this.getTableSchema(tableName);
      if (schema.length > 0) {
        fullSchema[tableName] = schema.map(col => ({
          column_name: col.COLUMN_NAME,
          data_type: col.DATA_TYPE,
          is_nullable: col.IS_NULLABLE,
          column_key: col.COLUMN_KEY,
          column_default: col.COLUMN_DEFAULT,
        }));
      }
    }
    return fullSchema;
  }
}