// src/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TableNamesService } from './services/table-names.service';
import { TableContentService } from './services/table-content.service';
import { TableRowService } from './services/table-row.service';
import { HelloService } from './services/hello.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { dataSourceOptions } from './data-source';
import { SyncModule } from './sync/sync.module';

@Module({
  imports: [TypeOrmModule.forRoot(dataSourceOptions), SyncModule],
  controllers: [AppController],
  providers: [
    AppService,
    TableNamesService,
    TableContentService,
    TableRowService,
    HelloService,
  ],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}