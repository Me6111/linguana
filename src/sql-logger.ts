// src/sql-logger.ts
import { Logger, QueryRunner, DataSource } from 'typeorm';

export class SqlLogger implements Logger {
  private maxLogEntries = 1000;
  private deleteBatchSize = 100;
  private logBuffer: { sql: string; timestamp: Date }[] = [];
  private bufferFlushInterval = 5000;
  private flushTimer: NodeJS.Timeout | null = null;
  private dataSource: DataSource;

  constructor(dataSource: DataSource) {
    this.dataSource = dataSource;
    this.startFlushTimer();
  }

  private startFlushTimer() {
    this.flushTimer = setInterval(() => this.flushLogBuffer(), this.bufferFlushInterval);
  }

  private stopFlushTimer() {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }
  }

  private async flushLogBuffer() {
    if (this.logBuffer.length === 0) return;

    const bufferToFlush = [...this.logBuffer];
    this.logBuffer = [];

    if (!bufferToFlush.length) return;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      if (bufferToFlush.length === 1) {
        await this.runQuery(bufferToFlush[0].sql, bufferToFlush[0].timestamp, queryRunner);
      } else {
        await this.runBulkInsert(bufferToFlush, queryRunner);
      }

      await this.limitLogEntries(queryRunner);
    } catch (error) {
      console.error('Error flushing log buffer:', error);
    } finally {
      await queryRunner.release();
    }
  }

  private async runQuery(sql: string, timestamp: Date, queryRunner: QueryRunner) {
    await queryRunner.query('INSERT INTO db_changes_history (sql, timestamp) VALUES (?, ?)', [sql, timestamp]);
  }

  private async runBulkInsert(buffer: { sql: string; timestamp: Date }[], queryRunner: QueryRunner) {
    const values = buffer.map((entry) => `("${entry.sql}", "${entry.timestamp.toISOString()}")`).join(',');
    await queryRunner.query(`INSERT INTO db_changes_history (sql, timestamp) VALUES ${values}`);
  }

  private async limitLogEntries(queryRunner: QueryRunner) {
    const countResult = await queryRunner.query('SELECT COUNT(*) as count FROM db_changes_history');
    const count = countResult[0].count;

    if (count > this.maxLogEntries) {
      let rowsToDelete = count - this.maxLogEntries;
      while (rowsToDelete > 0) {
        const batch = Math.min(rowsToDelete, this.deleteBatchSize);
        await queryRunner.query('DELETE FROM db_changes_history ORDER BY timestamp ASC LIMIT ?', [batch]);
        rowsToDelete -= batch;
      }
    }
  }

  async logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner): Promise<any> {
    this.logBuffer.push({ sql: query, timestamp: new Date() });
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