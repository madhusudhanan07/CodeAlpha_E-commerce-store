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
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId:     import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

if (!firebaseConfig.apiKey) {
  console.error(
    "🚨 FIREBASE CONFIG MISSING! 🚨\n" +
    "Your Vercel deployment is missing the VITE_FIREBASE_API_KEY environment variable.\n" +
    "Please go to your Vercel Dashboard -> Settings -> Environment Variables, and add all the variables from your local .env file."
  );
}

export const app  = initializeApp(firebaseConfig);
export const auth = getAuth(app);
