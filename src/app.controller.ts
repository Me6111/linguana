// src/app.controller.ts
import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('tables')
  async getTables(): Promise<string[]> {
    return this.appService.getTableNames();
  }

  @Get('tables/:tableName') // Dynamic route for table content
  async getTableContent(@Param('tableName') tableName: string): Promise<{ data: any[]; columns: any[] }> {
    return this.appService.getTableContent(tableName);
  }
}