// populate-migrations.ts
import * as fs from 'fs/promises';
import * as path from 'path';
import { DataSource, QueryResult } from 'typeorm';
import * as dotenv from 'dotenv';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });
console.log(process.env.MYSQL_URL);

async function populateMigrations() {
  const dataSource = new DataSource({
    type: 'mysql',
    url: process.env.MYSQL_URL,
    entities: [path.join(__dirname, '../../src', '**', '*.entity{.ts,.js}')],
    migrations: [path.join(__dirname, '../../src', 'migrations', '**', '*{.ts,.js}')],
  });

  await dataSource.initialize();
  const queryRunner = dataSource.createQueryRunner();

  try {
    await queryRunner.query('DELETE FROM `migrations`');
    console.log('Migrations table cleared.');

    const migrationFiles = await fs.readdir(path.join(__dirname, '../../src/migrations'));

    for (const file of migrationFiles) {
      if (file.endsWith('.ts') || file.endsWith('.js')) {
        const filePath = path.join(__dirname, '../../src/migrations', file);
        const migrationModule = await import(filePath);
        let migrationConstructor;

        if (migrationModule.default) {
          migrationConstructor = migrationModule.default;
        } else {
          migrationConstructor = Object.values(migrationModule)[0];
        }

        const migration = new migrationConstructor();

        let sql = "";
        try {
          const originalQuery = queryRunner.query.bind(queryRunner);
          queryRunner.query = async (query: string, parameters?: any[]): Promise<QueryResult> => {
            sql += query + ";\n";
            return Promise.resolve({ raw: [], affected: 0, records: [] });
          };

          try {
            await migration.up(queryRunner);
          } catch (migrationUpError) {
            console.error(`Error running migration ${file}: ${migrationUpError}`);
          }

          queryRunner.query = originalQuery;
        } catch (e) {
          console.error(`Error processing migration ${file}: ${e}`);
          sql = "";
        }

        const timestamp = parseInt(file.split('-')[0]);

        try {

          const mysqlUrl = new URL(process.env.MYSQL_URL!);
          const username = mysqlUrl.username;
          const password = mysqlUrl.password;
          const host = mysqlUrl.hostname;
          const port = mysqlUrl.port;
          const database = mysqlUrl.pathname.substring(1);

          const { stdout: diffSql, stderr: diffStderr } = await execAsync(
            `mysqldump -u${username} -p${password} -h${host} -P${port} --no-data --skip-routines --skip-triggers --skip-comments --databases ${database}`
          );

          if (diffStderr) {
            console.error(`mysqldump error: ${diffStderr}`);
          }

          if (diffSql) {
            sql = diffSql;
          }

          await queryRunner.query(
            'INSERT INTO `migrations` (`timestamp`, `name`, `sql`) VALUES (?, ?, ?)',
            [timestamp, file, sql],
          );
          console.log(`migration ${timestamp} sql was saved in migrations table.`);
        } catch (insertError) {
          console.error(`Error inserting migration ${file} into migrations table:`, insertError);
          console.error(`SQL for migration ${file}:`, sql);
        }
      }
    }

    console.log('Migrations table populated successfully.');
  } catch (error) {
    console.error('Error populating migrations table:', error);
    console.error(error);
  } finally {
    await queryRunner.release();
    await dataSource.destroy();
  }
}

populateMigrations();