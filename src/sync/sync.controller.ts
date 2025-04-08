import { Controller, Post, Body, Inject } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

@Controller('sync')
export class SyncController {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  @Post()
  async sync(@Body() syncData: { lastSQLOperationId: string; schema: Record<string, any> }) {
    console.log('Received sync request:', syncData);
    const clientTables = Object.keys(syncData.schema);
    const serverSchema: Record<string, any[]> = {};
    const migrations: string[] = [];

    try {
      const allTables = await this.connection.query(`
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = DATABASE()
      `);

      for (const table of allTables) {
        const tableName = table.table_name;
        const columnsInfo = await this.connection.query(`
          SELECT column_name, data_type, is_nullable, column_key, column_default
          FROM information_schema.columns
          WHERE table_schema = DATABASE() AND table_name = ?
        `, [tableName]);

        serverSchema[tableName] = columnsInfo.map(col => ({
          column_name: col.column_name,
          data_type: col.data_type,
          is_nullable: col.is_nullable,
          column_key: col.column_key,
          column_default: col.column_default,
        }));

        if (!clientTables.includes(tableName)) {
          const columnsDefinition = columnsInfo.map(col => {
            let columnDef = `\`${col.column_name}\``;
            if (col?.data_type) {
              columnDef += ` ${col.data_type.toUpperCase()}`;
            } else {
              console.warn(`Data type missing for column "${col?.column_name}" in table "${tableName}". Skipping column.`);
              return null;
            }
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
          }).filter(def => def !== null).join(', ');

          if (columnsDefinition) {
            migrations.push(`CREATE TABLE IF NOT EXISTS \`${tableName}\` (${columnsDefinition});`);
            const tableData = await this.connection.query(`SELECT * FROM \`${tableName}\``);
            for (const row of tableData) {
              const keys = Object.keys(row).map(key => `\`${key}\``).join(', ');
              const values = Object.values(row).map(value => typeof value === 'string' ? `'${value.replace(/'/g, "''")}'` : value).join(', ');
              migrations.push(`INSERT INTO \`${tableName}\` (${keys}) VALUES (${values});`);
            }
          }
        }
      }

      return {
        migrations: migrations,
        serverSchema: serverSchema,
        lastSQLOperationId: 'fullSchema_' + Date.now(),
      };
    } catch (error) {
      console.error('Error during sync:', error);
      return {
        migrations: [],
        serverSchema: {},
        lastSQLOperationId: 'error_' + Date.now(),
        error: error.message,
      };
    }
  }
}