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

      // Construct and print the corrected query with doubled single quotes
      const correctedQuery = `INSERT INTO \`${tableName}\` (${quotedColumns}) VALUES (${values.map(val => typeof val === 'string' ? `'${val.replace(/'/g, "''")}'` : val).join(', ')})`;
      console.log(`insert query: ${correctedQuery}`);

      AppDataSource.logger.logQuery(sql, values, queryRunner); // Log the insert query before executing

      await queryRunner.query(sql, values);

      // Save the corrected query and timestamp to db_changes_history using parameters.
      // Important: No outer quotes around correctedQuery.
      await queryRunner.query(
        'INSERT INTO db_changes_history (sql, timestamp) VALUES (?, ?)',
        [correctedQuery, new Date()],
      );

      await queryRunner.release();
    } catch (error) {
      console.error(`Error adding row to table ${tableName}:`, error);
      AppDataSource.logger.logQueryError(error.message, `INSERT INTO \`${tableName}\``, Object.values(rowData), queryRunner); //Log error.
      await queryRunner.release();
      throw error;
    }
  }
}