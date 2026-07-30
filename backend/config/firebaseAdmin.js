import 'dotenv/config';
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import fs from "fs";
import path from "path";

let serviceAccount = null;

if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
  } catch (err) {
    console.warn("⚠️ Failed to parse FIREBASE_SERVICE_ACCOUNT_JSON:", err.message);
  }
} else if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
  try {
    const filePath = path.resolve(process.env.FIREBASE_SERVICE_ACCOUNT_PATH);
    if (fs.existsSync(filePath)) {
      serviceAccount = JSON.parse(fs.readFileSync(filePath, "utf8"));
    } else {
      console.warn(`⚠️ Firebase service account file not found at path: ${filePath}`);
    }
  } catch (err) {
    console.warn("⚠️ Failed to read FIREBASE_SERVICE_ACCOUNT_PATH:", err.message);
  }
}

if (!getApps().length) {
  if (serviceAccount) {
    initializeApp({
      credential: cert(serviceAccount),
    });
  } else {
    // Initialize default firebase app if no custom credentials supplied
    try {
      initializeApp();
    } catch (e) {
      console.warn("⚠️ Firebase Admin SDK running without service account credentials.");
    }
  }
}

export const adminAuth = getApps().length ? getAuth() : null;
export default { adminAuth };