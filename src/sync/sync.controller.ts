import { Controller, Post, Body, Inject } from '@nestjs/common';
import { SyncService } from './sync.service';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

@Controller('sync')
export class SyncController {
  private readonly requiredTables = ['adjectives', 'nouns'];

  constructor(
    private readonly syncService: SyncService,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  @Post()
  async sync(@Body() syncData: { lastSQLOperationId: string; schema: Record<string, any> }) {
    console.log('Received sync request:', syncData);
    const clientTables = Object.keys(syncData.schema);
    const missingTables = this.requiredTables.filter(table => !clientTables.includes(table));
    const migrations: string[] = [];

    if (missingTables.length > 0) {
      for (const tableName of missingTables) {
        const tableInfo = await this.connection.query(`PRAGMA table_info("${tableName}")`);
        if (tableInfo.length > 0) {
          const columns = tableInfo.map(col => `"${col.name}" ${col.type}${col.notnull === 1 ? ' NOT NULL' : ''}${col.pk === 1 ? ' PRIMARY KEY AUTOINCREMENT' : ''}`).join(', ');
          migrations.push(`CREATE TABLE IF NOT EXISTS "${tableName}" (${columns});`);

          const tableData = await this.connection.query(`SELECT * FROM "${tableName}"`);
          for (const row of tableData) {
            const keys = Object.keys(row).map(key => `"${key}"`).join(', ');
            const values = Object.values(row).map(value => typeof value === 'string' ? `'${value.replace(/'/g, "''")}'` : value).join(', ');
            migrations.push(`INSERT INTO "${tableName}" (${keys}) VALUES (${values});`);
          }
        } else {
          console.warn(`Required table "${tableName}" not found on the server.`);
        }
      }
    }

    return {
      migrations: migrations,
      lastSQLOperationId: 'schemaSync_' + Date.now(), // Example ID after schema sync
    };
  }
}