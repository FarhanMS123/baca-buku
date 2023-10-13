import { initializeApp, cert, type App } from 'firebase-admin/app';
import { getStorage, } from "firebase-admin/storage";
import { env } from '~/env.mjs';

const globalForFirebase = globalThis as unknown as {
  firebase_app: App | undefined;
};

export const app = 
    globalForFirebase.firebase_app ??
    initializeApp({
        credential: cert({
            projectId: env.FIREBASE_PROJECT_ID,
            clientEmail: env.FIREBASE_CLIENT_EMAIL,
            privateKey: env.FIREBASE_PRIVATE_KEY,
        }),
        storageBucket: "anything-9c053.appspot.com"
    });

if (env.NODE_ENV !== "production") globalForFirebase.firebase_app = app;

export const storage = getStorage(app);
export const bucket = storage.bucket();
