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

      const existingColumns = await queryRunner.query(
        `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = ? AND TABLE_SCHEMA = ? AND COLUMN_NAME IN (${columns
          .map(() => '?')
          .join(', ')})`,
        [tableName, queryRunner.connection.driver.database, ...columns],
      );

      if (existingColumns.length !== columns.length) {
        throw new Error('One or more columns do not exist in the table.');
      }

      const quotedColumns = columns.map((column) => `\`${column}\``).join(', ');

      const sql = `INSERT INTO \`${tableName}\` (${quotedColumns}) VALUES (${placeholders})`;

      await queryRunner.query(sql, values);

      const valueStrings = values
        .map((value) => {
          if (typeof value === 'string') {
            return `'${value.replace(/'/g, "''")}'`;
          } else if (value === null || value === undefined) {
            return 'NULL';
          } else {
            return value;
          }
        })
        .join(', ');

      const sqlWithValues = `INSERT INTO \`${tableName}\` (${quotedColumns}) VALUES (${valueStrings})`;

      await queryRunner.query(
        `INSERT INTO \`db_changes_history\` (\`sql\`, \`timestamp\`) VALUES (?, NOW())`,
        [sqlWithValues],
      );

      await queryRunner.release();
    } catch (error) {
      console.error(`Error adding row to table ${tableName}:`, error);
      await queryRunner.release();
      throw error;
    }
  }

  async deleteTableRow(tableName: string, whereClause: string): Promise<void> {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      const sql = `DELETE FROM \`${tableName}\` WHERE ${whereClause}`;

      await queryRunner.query(sql);
      await queryRunner.query(
        `INSERT INTO \`db_changes_history\` (\`sql\`, \`timestamp\`) VALUES (?, NOW())`,
        [sql],
      );

      await queryRunner.release();
    } catch (error) {
      console.error(`Error deleting row from table ${tableName}:`, error);
      await queryRunner.release();
      throw error;
    }
  }
}