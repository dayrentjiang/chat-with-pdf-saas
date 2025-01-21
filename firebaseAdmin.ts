import { initializeApp, getApps, App, getApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const serviceKey = require("@/service_key.json");

let app: App;

// Initialize the Firebase Admin SDK
if (getApps().length === 0) {
  app = initializeApp({
    credential: cert(serviceKey) // Ensure service key matches the structure
  });
} else {
  app = getApp(); // Reuse the existing app if already initialized
}

const adminDb = getFirestore(app);

export { app as adminApp, adminDb };
