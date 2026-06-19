import "server-only";
import {
  applicationDefault,
  cert,
  getApps,
  initializeApp,
  type App,
} from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

function getAdminApp(): App {
  const existing = getApps();
  if (existing.length) return existing[0];

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  // Production (e.g. Vercel): explicit service-account credentials.
  if (privateKey) {
    return initializeApp({
      credential: cert({
        projectId,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // Stored with literal \n in env — restore real newlines.
        privateKey: privateKey.replace(/\\n/g, "\n"),
      }),
    });
  }

  // Local dev: Application Default Credentials (gcloud auth application-default login).
  return initializeApp({ credential: applicationDefault(), projectId });
}

let _db: Firestore | undefined;
export function adminDb(): Firestore {
  if (!_db) _db = getFirestore(getAdminApp());
  return _db;
}
