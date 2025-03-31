// src/table-content.service.ts
import { Injectable } from '@nestjs/common';
import AppDataSource from './data-source';

@Injectable()
export class TableContentService {
  async getTableContent(
    tableName: string,
  ): Promise<{ data: any[]; columns: any[] }> {
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
        const isSystemColumn =
          col.COLUMN_NAME.toLowerCase() === 'updatedat' ||
          col.COLUMN_NAME.toLowerCase() === 'version';
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
}