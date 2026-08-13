/**
 * db.js — Firestore Database Connection
 *
 * Replaces the previous MySQL connection pool.
 * Re-exports the Firestore `db` instance from firebaseAdmin.js so that
 * all models can continue to `import db from '../config/db.js'` without change.
 *
 * connectDB() is kept as a lightweight stub so server.js works unchanged.
 */

import { db } from './firebaseAdmin.js';

/**
 * Verifies the Firestore instance is available at startup.
 * Logs success or a warning if credentials are missing.
 */
export const connectDB = async () => {
  if (db) {
    console.log('✅ Firebase Firestore connected successfully.');
  } else {
    console.warn('⚠️ Firestore db instance is null — check Firebase credentials.');
  }
};

export default db;
