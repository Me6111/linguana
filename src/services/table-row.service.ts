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

      // Execute the query using the original rowData values.
      await queryRunner.query(`INSERT INTO \`${tableName}\` (${quotedColumns}) VALUES (${placeholders})`, values);

      // Construct SQL with actual values
      const valueStrings = values.map((value) => {
        if (typeof value === 'string') {
          return `'${value.replace(/'/g, "''")}'`; // Escape single quotes within strings
        } else if (value === null || value === undefined) {
          return 'NULL';
        } else {
          return value; // Numbers, booleans, etc.
        }
      }).join(', ');

      const sqlWithValues = `INSERT INTO \`${tableName}\` (${quotedColumns}) VALUES (${valueStrings})`;

      // Insert the SQL query with actual values into the db_changes_history table.
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
}