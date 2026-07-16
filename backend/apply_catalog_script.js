import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

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

  const sqlPath = path.resolve('../database/fix_product_images.sql');
  console.log(`Reading SQL from ${sqlPath}...`);
  const sql = fs.readFileSync(sqlPath, 'utf8');

  console.log('Executing SQL (this may take a moment)...');
  await connection.query(sql);
  
  console.log('Successfully expanded catalog in the database.');
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
