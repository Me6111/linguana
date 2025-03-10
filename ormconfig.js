require('dotenv').config();

const mysqlUrl = new URL(process.env.MYSQL_URL);

module.exports = {
  type: "mysql",
  host: mysqlUrl.hostname,
  port: parseInt(mysqlUrl.port),
  username: mysqlUrl.username,
  password: mysqlUrl.password,
  database: mysqlUrl.pathname.substring(1),
  entities: ["dist/**/*.entity.js"],
  migrations: ["dist/migrations/*.js"],
  subscribers: ["dist/subscribers/*.js"],
  cli: {
    entitiesDir: "src/entity",
    migrationsDir: "src/migrations",
    subscribersDir: "src/subscribers",
    commands: ["dist/scripts/delete-adjective-tables.js"], 
  },
};