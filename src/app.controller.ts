import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('tables') // Corrected: Base route is 'tables'
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getTables(): Promise<string[]> {
    return this.appService.getTableNames();
  }

  @Get(':tableName') // Corrected: Use :tableName directly after /tables
  async getTableContent(@Param('tableName') tableName: string): Promise<{ data: any[]; columns: any[] }> {
    return this.appService.getTableContent(tableName);
  }

  @Post(':tableName') // Corrected: Use :tableName directly after /tables
  async addTableRow(
    @Param('tableName') tableName: string,
    @Body() rowData: any,
  ): Promise<void> {
    return this.appService.addTableRow(tableName, rowData);
  }

  @Get('hello')
  getHello(): string {
    return this.appService.getHello();
  }
}