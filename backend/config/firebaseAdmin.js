/**
 * firebaseAdmin.js — Firebase Admin SDK Initialization
 *
 * Initializes the Firebase Admin SDK using the Service Account JSON file
 * co-located at backend/config/serviceAccountKey.json.
 *
 * Uses the firebase-admin v14+ modular API:
 *  - initializeApp, getApps, cert  from 'firebase-admin/app'
 *  - getAuth                       from 'firebase-admin/auth'
 *
 * createRequire(import.meta.url) is used to load the JSON safely in an
 * ES Module context. The require path is resolved relative to THIS file,
 * so './serviceAccountKey.json' always maps to backend/config/serviceAccountKey.json
 * regardless of where the Node process is started from.
 *
 * Usage:
 *   import { adminAuth } from './config/firebaseAdmin.js';
 */

import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { createRequire } from 'module';

// createRequire anchors resolution to this file's directory (backend/config/),
// so './serviceAccountKey.json' resolves correctly regardless of CWD.
const require        = createRequire(import.meta.url);
const serviceAccount = require('./serviceAccountKey.json');

// Only initialize once — guard against hot-reload double-init
if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
  });
}

export const adminAuth = getAuth();
export default { getAuth, getApps };
