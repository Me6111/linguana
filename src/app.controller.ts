// src/app.controller.ts
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { DatabaseService } from './database/database.service';

@Controller() // This is CRUCIAL!  It defines this as a controller.
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly databaseService: DatabaseService, // Inject DatabaseService
  ) {}

  @Get() // For the root route (/)
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('data') // This defines the /data route!
  async getDataFromExampleTable(): Promise<any[]> {
    try {
      const data = await this.databaseService.getAllFromExampleTable();
      return data;
    } catch (error) {
      console.error("Error in controller:", error);
      return [{ error: error.message }];
    }
  }
}