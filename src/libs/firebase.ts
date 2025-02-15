import { FirebaseApp, initializeApp } from 'firebase/app';
import admin from 'firebase-admin';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

const serviceAccount = JSON.parse(
  Buffer.from(process.env.GCP_SERVICE_ACCOUNT ?? '', 'base64').toString(),
);

const { storage } = admin;
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
admin.firestore().settings({ ignoreUndefinedProperties: true });

const app = initializeApp(firebaseConfig);
const auth = getAuth(app as FirebaseApp);

export { auth, storage };
