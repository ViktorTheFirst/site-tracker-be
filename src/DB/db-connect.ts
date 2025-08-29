import mysql from 'mysql2';

const pool = mysql
  .createPool({
    user: process.env.SQL_DB_USER!,
    password: process.env.SQL_DB_PASSWORD!,
    host: process.env.SQL_DB_HOST!,
    port: Number(process.env.SQL_DB_PORT!),
    database: process.env.SQL_DB_NAME!,
    dateStrings: true,
  })
  .promise();

export default pool;
