// src/data-source.ts
import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import { SqlLogger } from './sql-logger'; // Import the custom logger

dotenv.config();

if (!process.env.MYSQL_URL) {
  console.error('Error: MYSQL_URL environment variable is not set.');
  process.exit(1);
}

export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  url: process.env.MYSQL_URL,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  synchronize: false,
  logger: new SqlLogger(), // Use the custom logger
  logging: true, // TypeORM's built-in logging (optional)
};

const AppDataSource = new DataSource(dataSourceOptions);
export default AppDataSource;

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization:', err);
  });