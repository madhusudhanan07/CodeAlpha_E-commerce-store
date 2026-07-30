/**
 * firebase.ts — Firebase Client SDK Initialization
 *
 * Initializes Firebase app using environment variables injected by Vite.
 * Never hardcode credentials — all config is read from frontend/.env.
 *
 * Exports:
 *  - app      → initialized Firebase App instance
 *  - auth     → Firebase Auth instance (used in AuthContext)
 */

import { initializeApp } from 'firebase/app';
import {
  initializeAuth,
  browserLocalPersistence,
  browserPopupRedirectResolver,
} from 'firebase/auth';

const cleanEnv = (val?: string) => {
  if (!val) return val;
  // Remove accidental surrounding quotes and whitespace
  return val.replace(/^["']|["']$/g, '').trim();
};

const firebaseConfig = {
  apiKey:            cleanEnv(import.meta.env.VITE_FIREBASE_API_KEY),
  authDomain:        cleanEnv(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN),
  projectId:         cleanEnv(import.meta.env.VITE_FIREBASE_PROJECT_ID),
  storageBucket:     cleanEnv(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET),
  messagingSenderId: cleanEnv(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID),
  appId:             cleanEnv(import.meta.env.VITE_FIREBASE_APP_ID),
  measurementId:     cleanEnv(import.meta.env.VITE_FIREBASE_MEASUREMENT_ID),
};

if (!firebaseConfig.apiKey) {
  console.error(
    "🚨 FIREBASE CONFIG MISSING! 🚨\n" +
    "Your Vercel deployment is missing the VITE_FIREBASE_API_KEY environment variable.\n" +
    "Please go to your Vercel Dashboard -> Settings -> Environment Variables, and add all the variables from your local .env file."
  );
}

// Initialize safely to prevent catastrophic UI crashes
let appInstance;
let authInstance;

try {
  appInstance = initializeApp(firebaseConfig);
  authInstance = initializeAuth(appInstance, {
    persistence: browserLocalPersistence,
    popupRedirectResolver: browserPopupRedirectResolver,
  });
} catch (error) {
  console.error("🔥 Failed to initialize Firebase:", error);
  // Provide dummy objects to prevent 'Cannot read properties of undefined' crashes in React
  appInstance = {} as any;
  authInstance = { currentUser: null, onAuthStateChanged: () => () => {} } as any;
}

export const app = appInstance;
export const auth = authInstance;
