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
        try {
          const columnsInfo = await this.connection.query(`
            SELECT column_name, data_type, is_nullable, column_key, column_default
            FROM information_schema.columns
            WHERE table_schema = DATABASE() AND table_name = ?
          `, [tableName]);

          if (columnsInfo.length > 0) {
            const columnsDefinition = columnsInfo.map(col => {
              let columnDef = `\`${col.column_name}\` ${col.data_type.toUpperCase()}`;
              if (col.is_nullable === 'NO') {
                columnDef += ' NOT NULL';
              }
              if (col.column_key === 'PRI') {
                columnDef += ' PRIMARY KEY AUTO_INCREMENT';
              }
              if (col.column_default !== null) {
                columnDef += ` DEFAULT '${col.column_default}'`;
              }
              return columnDef;
            }).join(', ');

            migrations.push(`CREATE TABLE IF NOT EXISTS \`${tableName}\` (${columnsDefinition});`);

            const tableData = await this.connection.query(`SELECT * FROM \`${tableName}\``);
            for (const row of tableData) {
              const keys = Object.keys(row).map(key => `\`${key}\``).join(', ');
              const values = Object.values(row).map(value => typeof value === 'string' ? `'${value.replace(/'/g, "''")}'` : value).join(', ');
              migrations.push(`INSERT INTO \`${tableName}\` (${keys}) VALUES (${values});`);
            }
          } else {
            console.warn(`Required table "${tableName}" not found on the server.`);
          }
        } catch (error) {
          console.error(`Error fetching server schema for table "${tableName}":`, error);
        }
      }
    }

    return {
      migrations: migrations,
      lastSQLOperationId: 'schemaSync_' + Date.now(), // Example ID after schema sync
    };
  }
}