// src/data-source.ts
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

if (!process.env.MYSQL_URL) {
  console.error('Error: MYSQL_URL environment variable is not set.');
  process.exit(1);
}

export const AppDataSource = new DataSource({
  type: 'mysql',
  url: process.env.MYSQL_URL,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  synchronize: true, // Change synchronize to true (for development) or run migrations
});

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization:', err);
  });