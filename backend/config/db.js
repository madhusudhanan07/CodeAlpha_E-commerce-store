/**
 * db.js — MySQL Database Connection Configuration
 * Uses mysql2 with promise support for async/await compatibility.
 * Reads all credentials from environment variables via dotenv.
 */

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// ---------------------------------------------------------------------------
// Connection pool — preferred over single connection for production workloads.
// A pool reuses connections, handles reconnections, and limits concurrency.
// ---------------------------------------------------------------------------
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'codealpha_ecommerce',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

/**
 * Verifies the pool can reach the database at startup.
 * Logs success or exits the process on failure.
 */
export const connectDB = async () => {
  try {
    const connection = await pool.getConnection();
    console.log(`✅ MySQL connected — host: ${process.env.DB_HOST || 'localhost'}`);
    connection.release();
  } catch (error) {
    console.error('❌ MySQL connection failed:', error.message);
    process.exit(1);
  }
};

export default pool;
