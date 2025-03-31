// src/sql-logger.ts
import { Logger, QueryRunner } from 'typeorm';

export class SqlLogger implements Logger {
  logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner): any {
    if (queryRunner) {
      queryRunner.query(
        'INSERT INTO db_changes_history (sql, timestamp) VALUES (?, NOW())',
        [query],
      );
    } else {
        //If query runner is missing, it probably means that the query is executed during the initialization phase.
        console.log('SQL Query:', query);
    }
  }

  // Implement other Logger interface methods (empty or console.log)
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