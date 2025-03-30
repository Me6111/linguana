// src/app.service.ts
import { Injectable } from '@nestjs/common';
import { TableNamesService } from './table-names.service';
import { TableContentService } from './table-content.service';
import { TableRowService } from './table-row.service';
import { HelloService } from './hello.service';

@Injectable()
export class AppService {
  constructor(
    private readonly tableNamesService: TableNamesService,
    private readonly tableContentService: TableContentService,
    private readonly tableRowService: TableRowService,
    private readonly helloService: HelloService,
  ) {}

  async getTableNames(): Promise<string[]> {
    return this.tableNamesService.getTableNames();
  }

  async getTableContent(
    tableName: string,
  ): Promise<{ data: any[]; columns: any[] }> {
    return this.tableContentService.getTableContent(tableName);
  }

  async addTableRow(tableName: string, rowData: any): Promise<void> {
    return this.tableRowService.addTableRow(tableName, rowData);
  }

  getHello(): string {
    return this.helloService.getHello();
  }
}