import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { dataSourceOptions } from './data-source';
import { SyncModule } from './sync/sync.module';
import { TableNamesService } from './table-names.service'; // Import TableNamesService

@Module({
  imports: [TypeOrmModule.forRoot(dataSourceOptions), SyncModule],
  controllers: [AppController],
  providers: [AppService, TableNamesService], // Add TableNamesService to providers
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}