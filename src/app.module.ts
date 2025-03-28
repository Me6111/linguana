import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { dataSourceOptions } from './data-source';
import { SyncModule } from './sync/sync.module'; // Import SyncModule

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    SyncModule, // Add SyncModule to imports
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}