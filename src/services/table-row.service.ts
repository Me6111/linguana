// src/table-row.service.ts
import { Injectable } from '@nestjs/common';
import AppDataSource from '../data-source';

@Injectable()
export class TableRowService {
  async addTableRow(tableName: string, rowData: any): Promise<void> {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      const columns = Object.keys(rowData);
      const values = Object.values(rowData);
      const placeholders = values.map(() => '?').join(', ');

      // Verify that the columns exist in the table.
      const existingColumns = await queryRunner.query(
        `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = ? AND TABLE_SCHEMA = ? AND COLUMN_NAME IN (${columns
          .map(() => '?')
          .join(', ')})`,
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
}