import { Controller, Get, Param, Post, Body } from '@nestjs/common';
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

  @Get('tables/:tableName')
  async getTableContent(@Param('tableName') tableName: string): Promise<{ data: any[]; columns: any[] }> {
    return this.appService.getTableContent(tableName);
  }

  @Post('tables/:tableName')
  async addTableRow(
    @Param('tableName') tableName: string,
    @Body() rowData: any, // Assuming JSON body
  ): Promise<void> {
    return this.appService.addTableRow(tableName, rowData);
  }
}