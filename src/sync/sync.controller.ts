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
    const TablesToCreate: Record<string, { name: string; type: string }[]> = {};
    const lastId = syncData.lastSQLOperationId;

    try {
      for (const tableName of this.requiredTables) {
        const columnsInfo = await this.connection.query(
          `SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_KEY, COLUMN_DEFAULT
           FROM INFORMATION_SCHEMA.COLUMNS
           WHERE TABLE_NAME = ? AND TABLE_SCHEMA = DATABASE()`,
          [tableName],
        );

        TablesToCreate[tableName] = columnsInfo.map(col => ({
          name: col.COLUMN_NAME,
          type: col.DATA_TYPE.toUpperCase(), // Convert to uppercase for consistency
          notnull: col.IS_NULLABLE === 'NO',
          pk: col.COLUMN_KEY === 'PRI',
          dflt_value: col.COLUMN_DEFAULT,
        }));
      }

      return {
        TablesToCreate: TablesToCreate,
        lastSQLOperationId: lastId,
      };
    } catch (error) {
      console.error('Error during sync:', error);
      return {
        TablesToCreate: {},
        lastSQLOperationId: lastId,
        error: error.message,
      };
    }
  }
}