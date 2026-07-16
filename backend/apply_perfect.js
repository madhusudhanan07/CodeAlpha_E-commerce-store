import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

async function run() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'codealpha_ecommerce',
    multipleStatements: true
  });

  const sqlPath = path.resolve('../database/seed_120_perfect.sql');
  console.log(`Reading PERFECT SQL SEED from ${sqlPath}...`);
  const sql = fs.readFileSync(sqlPath, 'utf8');

  console.log('Executing SQL (Truncating and Replacing all products perfectly)...');
  await connection.query(sql);
  
  await connection.end();
  console.log('Successfully re-seeded the database with 100% accurate imagery and categories!');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
