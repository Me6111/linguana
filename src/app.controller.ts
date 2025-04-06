import { Controller, Get, Param, Post, Body, Delete, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('tables')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getTables(): Promise<string[]> {
    return this.appService.getTableNames();
  }

  @Get(':tableName')
  async getTableContent(@Param('tableName') tableName: string): Promise<{ data: any[]; columns: any[] }> {
    return this.appService.getTableContent(tableName);
  }

  @Post(':tableName')
  async addTableRow(
    @Param('tableName') tableName: string,
    @Body() rowData: any,
  ): Promise<void> {
    return this.appService.addTableRow(tableName, rowData);
  }

  @Delete(':tableName')
  async deleteTableRow(
    @Param('tableName') tableName: string,
    @Query('whereClause') whereClause: string,
  ): Promise<void> {
    return this.appService.deleteTableRow(tableName, whereClause);
  }

  @Get('hello')
  getHello(): string {
    return this.appService.getHello();
  }
}