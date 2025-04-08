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
    const serverSchema: Record<string, Record<string, string>> = {};

    try {
      for (const tableName of this.requiredTables) {
        const columnsInfo = await this.connection.query(
          `SELECT COLUMN_NAME, DATA_TYPE
           FROM INFORMATION_SCHEMA.COLUMNS
           WHERE TABLE_NAME = ? AND TABLE_SCHEMA = DATABASE()`,
          [tableName],
        );

        serverSchema[tableName] = {};
        columnsInfo.forEach(col => {
          serverSchema[tableName][col.COLUMN_NAME] = col.DATA_TYPE;
        });
      }

      return {
        serverSchema: serverSchema,
        lastSQLOperationId: 'schemaDict_' + Date.now(),
      };
    } catch (error) {
      console.error('Error during sync:', error);
      return {
        serverSchema: {},
        lastSQLOperationId: 'errorDict_' + Date.now(),
        error: error.message,
      };
    }
  }
}