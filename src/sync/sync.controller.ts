import { Controller, Post, Body, Inject } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

@Controller('sync')
export class SyncController {
  private readonly requiredTables = ['adjectives', 'nouns'];

  constructor(@InjectConnection() private readonly connection: Connection) {}

  @Post()
  async sync(@Body() syncData: { lastSQLOperationId: string; schema: Record<string, any> }) {
    console.log('Received sync request:', syncData);
    const serverSchema: Record<string, any[]> = {};

    try {
      for (const tableName of this.requiredTables) {
        const columnsInfo = await this.connection.query(
          `SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_KEY, COLUMN_DEFAULT
           FROM INFORMATION_SCHEMA.COLUMNS
           WHERE TABLE_NAME = ? AND TABLE_SCHEMA = DATABASE()
           ORDER BY ORDINAL_POSITION`,
          [tableName],
        );

        serverSchema[tableName] = columnsInfo.map(col => ({
          column_name: col?.COLUMN_NAME,
          data_type: col?.DATA_TYPE,
          is_nullable: col?.IS_NULLABLE,
          column_key: col?.COLUMN_KEY,
          column_default: col?.COLUMN_DEFAULT,
        })).filter(colInfo => colInfo.column_name !== undefined && colInfo.data_type !== undefined);
      }

      return {
        serverSchema: serverSchema,
        lastSQLOperationId: 'schemaInfo_' + Date.now(),
        migrations: [],
      };
    } catch (error) {
      console.error('Error during sync:', error);
      return {
        serverSchema: {},
        lastSQLOperationId: 'error_' + Date.now(),
        migrations: [],
        error: error.message,
      };
    }
  }
}