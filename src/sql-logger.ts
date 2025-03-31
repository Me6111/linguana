// src/sql-logger.ts
import { Logger, QueryRunner } from 'typeorm';

export class SqlLogger implements Logger {
  private maxLogEntries = 1000; // Adjust as needed
  private deleteBatchSize = 100; // Adjust as needed

  async logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner): Promise<any> {
    if (queryRunner) {
      try {
        await queryRunner.query(
          'INSERT INTO db_changes_history (sql, timestamp) VALUES (?, NOW())',
          [query],
        );

        // Limit the number of log entries
        const countResult = await queryRunner.query('SELECT COUNT(*) as count FROM db_changes_history');
        const count = countResult[0].count;

        if (count > this.maxLogEntries) {
          let rowsToDelete = count - this.maxLogEntries;
          while (rowsToDelete > 0) {
            const batch = Math.min(rowsToDelete, this.deleteBatchSize);
            await queryRunner.query(
              'DELETE FROM db_changes_history ORDER BY timestamp ASC LIMIT ?',
              [batch],
            );
            rowsToDelete -= batch;
          }
        }
      } catch (error) {
        console.error('Error logging SQL query:', error);
      }
    } else {
      console.log('SQL Query:', query);
    }
  }

  logQueryError(error: string, query: string, parameters?: any[], queryRunner?: QueryRunner): any {
    console.error('SQL Query Error:', error, query);
  }

  logQuerySlow(time: number, query: string, parameters?: any[], queryRunner?: QueryRunner): any {
    console.warn('SQL Query Slow:', time, query);
  }

  logSchemaBuild(message: string, queryRunner?: QueryRunner): any {
    console.log('Schema Build:', message);
  }

  logMigration(message: string, queryRunner?: QueryRunner): any {
    console.log('Migration:', message);
  }

  log(level: 'log' | 'info' | 'warn', message: any, queryRunner?: QueryRunner): any {
    if (level === 'log') {
      console.log(message);
    } else if (level === 'info') {
      console.info(message);
    } else if (level === 'warn') {
      console.warn(message);
    }
  }
}