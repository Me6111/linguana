// src/app.service.ts
import { Injectable } from '@nestjs/common';
import AppDataSource from './data-source';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class AppService {
  async getTableNames(): Promise<string[]> {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      const mysqlUrl = process.env.MYSQL_URL;
      if (!mysqlUrl) {
        throw new Error('MYSQL_URL environment variable is not set.');
      }

      const urlParts = new URL(mysqlUrl);
      const databaseName = urlParts.pathname.substring(1);

      const results: { TABLE_NAME: string }[] = await queryRunner.query(
        'SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = ?',
        [databaseName],
      );
      await queryRunner.release();
      return results.map((row) => row.TABLE_NAME);
    } catch (error) {
      console.error('Error fetching table names:', error);
      await queryRunner.release();
      throw error;
    }
  }

  async getTableContent(tableName: string): Promise<{ data: any[]; columns: any[] }> {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      const results: any[] = await queryRunner.query(`SELECT * FROM \`${tableName}\``);

      const columns: any[] = await queryRunner.query(
        `SELECT COLUMN_NAME, DATA_TYPE, ORDINAL_POSITION, EXTRA FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = ? AND TABLE_SCHEMA = ? ORDER BY ORDINAL_POSITION`,
        [tableName, queryRunner.connection.driver.database],
      );

      const enhancedColumns = columns.map((col) => {
        const isAutoIncrement = col.EXTRA.includes('auto_increment');
        const isSystemColumn = col.COLUMN_NAME.toLowerCase() === 'updatedat' || col.COLUMN_NAME.toLowerCase() === 'version';
        return {
          ...col,
          isModifiable: !isAutoIncrement && !isSystemColumn,
        };
      });

      await queryRunner.release();

      return {
        data: results,
        columns: enhancedColumns,
      };
    } catch (error) {
      console.error(`Error fetching content for table ${tableName}:`, error);
      await queryRunner.release();
      throw error;
    }
  }

  async addTableRow(tableName: string, rowData: any): Promise<void> {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      const columns = Object.keys(rowData);
      const values = Object.values(rowData);
      const placeholders = values.map(() => '?').join(', ');

      // Verify that the columns exist in the table.
      const existingColumns = await queryRunner.query(
        `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = ? AND TABLE_SCHEMA = ? AND COLUMN_NAME IN (${columns.map(() => '?').join(', ')})`,
        [tableName, queryRunner.connection.driver.database, ...columns],
      );

      if (existingColumns.length !== columns.length) {
        throw new Error('One or more columns do not exist in the table.');
      }

      const quotedColumns = columns.map((column) => `\`${column}\``).join(', '); // Quote column names

      const sql = `INSERT INTO \`${tableName}\` (${quotedColumns}) VALUES (${placeholders})`;

      await queryRunner.query(sql, values);
      await queryRunner.release();
    } catch (error) {
      console.error(`Error adding row to table ${tableName}:`, error);
      await queryRunner.release();
      throw error;
    }
  }

  getHello(): string {
    return 'Hello World!';
  }
}