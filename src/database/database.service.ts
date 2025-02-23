// src/database/database.service.ts
import { Injectable } from '@nestjs/common'; // Remove OnModuleInit, OnModuleDestroy
import { DataSource } from 'typeorm';
import { InjectConnection } from '@nestjs/typeorm';

@Injectable()
export class DatabaseService { // No need for OnModuleInit, OnModuleDestroy
  constructor(@InjectConnection() private dataSource: DataSource) {} // Just inject

  getDataSource(): DataSource { // Return DataSource
    return this.dataSource;
  }

  async getAllFromExampleTable() {
    return this.dataSource.query('SELECT * FROM example_table');
  }
}