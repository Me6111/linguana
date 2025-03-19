// src/app.service.ts
import { Injectable } from '@nestjs/common';
import { AppDataSource } from './data-source';
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

      // Fetch column information including data types
      const columns: any[] = await queryRunner.query(
        `SELECT COLUMN_NAME, DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = ? AND TABLE_SCHEMA = ?`,
        [tableName, queryRunner.connection.driver.database],
      );

      await queryRunner.release();

      return {
        data: results,
        columns: columns,
      };
    } catch (error) {
      console.error(`Error fetching content for table ${tableName}:`, error);
      await queryRunner.release();
      throw error;
    }
  }

  getHello(): string {
    return 'Hello World!';
  }
}