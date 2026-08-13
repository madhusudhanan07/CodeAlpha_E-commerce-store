import 'dotenv/config';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs';
import path from 'path';

let serviceAccount = null;
if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
} else if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
  const filePath = path.resolve(process.env.FIREBASE_SERVICE_ACCOUNT_PATH);
  if (fs.existsSync(filePath)) {
    serviceAccount = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }
}

if (!getApps().length) {
  if (serviceAccount) {
    initializeApp({ credential: cert(serviceAccount) });
  } else {
    initializeApp();
  }
}

const db = getFirestore();

async function run() {
  const snap = await db.collection('products').limit(5).get();
  snap.forEach(doc => {
    const data = doc.data();
    console.log(`ID: ${data.id} - Name: ${data.name}\n  Image: ${data.image_url}\n`);
  });
}

run();
