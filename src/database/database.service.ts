import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createConnection } from 'mysql2/promise';

@Injectable()
export class DatabaseService {
  private connection;

  constructor(private configService: ConfigService) {
      this.initializeConnection();
  }

  private async initializeConnection() {
    try {
      this.connection = await createConnection({
        host: this.configService.get<string>('DB_HOST'),
        user: this.configService.get<string>('DB_USER'),
        password: this.configService.get<string>('DB_PASSWORD'),
        database: this.configService.get<string>('DB_NAME'),
      });
      console.log('Database connection established.');
    } catch (error) {
      console.error('Error connecting to database:', error);
      throw error; // Re-throw the error to be handled by the application
    }
  }

  async getAllFromExampleTable(): Promise<any[]> {
      try {
          if (!this.connection) {
              await this.initializeConnection();
          }
        const [rows] = await this.connection.execute('SELECT * FROM example_table');
        return rows;
      } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
      }
    }
}