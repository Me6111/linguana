import { Controller, Post, Body, Inject } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

@Controller('sync')
export class SyncController {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  @Post()
  async sync(@Body() syncData: { lastSQLOperationId: string; schema: Record<string, any> }) {
    console.log('Received sync request:', syncData);
    const serverSchema: Record<string, any[]> = {};

    try {
      const allTables = await this.connection.query(`
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = DATABASE()
      `);

      for (const table of allTables) {
        const tableName = table?.table_name;
        if (tableName) {
          const columnsInfo = await this.connection.query(`
            SELECT column_name, data_type, is_nullable, column_key, column_default
            FROM information_schema.columns
            WHERE table_schema = DATABASE() AND table_name = ?
          `, [tableName]);

          serverSchema[tableName] = columnsInfo.map(col => ({
            column_name: col?.column_name,
            data_type: col?.data_type,
            is_nullable: col?.is_nullable,
            column_key: col?.column_key,
            column_default: col?.column_default,
          })).filter(colInfo => colInfo.column_name !== undefined && colInfo.data_type !== undefined);
        }
      }

      return {
        serverSchema: serverSchema,
        lastSQLOperationId: 'fullSchema_' + Date.now(),
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