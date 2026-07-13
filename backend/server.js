/**
 * server.js — HTTP Server Entry Point
 *
 * Responsibilities:
 *  1. Load environment variables
 *  2. Verify database connectivity
 *  3. Create the HTTP server and begin listening
 *
 * This file intentionally contains NO middleware or business logic.
 * All application configuration lives in app.js.
 */

import 'dotenv/config';
import app from './app.js';
import { connectDB } from './config/db.js';

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || 'localhost';

// Establish database connection before accepting traffic
await connectDB();

app.listen(PORT, HOST, () => {
  console.log(`\n🚀 Server running at http://${HOST}:${PORT}`);
  console.log(`📦 Environment : ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔹 API root    : http://${HOST}:${PORT}/\n`);
});
