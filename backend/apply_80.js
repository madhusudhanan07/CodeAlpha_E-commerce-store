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

  console.log('Patching schema to support explicit product fields...');
  
  const cols = [
    { name: 'brand', def: 'VARCHAR(100) DEFAULT NULL' },
    { name: 'discount_percentage', def: 'DECIMAL(5,2) DEFAULT "0.00"' },
    { name: 'rating', def: 'DECIMAL(3,1) DEFAULT "4.0"' },
    { name: 'review_count', def: 'INT UNSIGNED DEFAULT "0"' }
  ];

  for (const c of cols) {
    try {
      await connection.query(`ALTER TABLE products ADD COLUMN ${c.name} ${c.def}`);
      console.log(`Added column ${c.name}`);
    } catch (e) {
      if (e.code !== 'ER_DUP_FIELDNAME') {
        throw e;
      }
    }
  }

  const sqlPath = path.resolve('../database/seed_80_perfect.sql');
  console.log(`Reading SQL from ${sqlPath}...`);
  let sql = fs.readFileSync(sqlPath, 'utf8');
  
  // Safely strip the DELIMITER block since it was failing parsing in JS
  sql = sql.replace(/DROP PROCEDURE IF EXISTS AddProductColumns;[\s\S]*?SET FOREIGN_KEY_CHECKS = 1;/g, 'SET FOREIGN_KEY_CHECKS = 1;');

  console.log('Executing SQL Truncates and inserts...');
  await connection.query(sql);
  
  await connection.end();
  console.log('Successfully re-seeded the database with 80 precise products featuring ratings, brands, and discounts!');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
