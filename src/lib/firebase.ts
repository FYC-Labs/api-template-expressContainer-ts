import admin from "firebase-admin";
import { ENV } from "../config";
import crypto from 'crypto';

const { APP_ENV, GCP_TENANT_ID, FIREBASE_SERVICE_ACCOUNT } = ENV;
if (!FIREBASE_SERVICE_ACCOUNT) {
  throw new Error("Cannot continue without a firebase service account");
}

if (!GCP_TENANT_ID) {
  throw new Error("Cannot continue without a firebase service account");
}

const app = admin.initializeApp({
  credential: admin.credential.cert(FIREBASE_SERVICE_ACCOUNT),
});
const auth = admin.auth(app);

function getTenantFirebaseAuth() {
  return auth.tenantManager().authForTenant(GCP_TENANT_ID as string);
}

export async function upsertUserInFirebase(payload: Record<"email", string>) {
  const tenantAuth = getTenantFirebaseAuth();
  const { email } = payload;

  if (process.env.NODE_ENV === "test") {
    return {
      uid: new Date().getTime().toString(),
    };
  }

  let userInFirebase = null;

  try {
    userInFirebase = await tenantAuth.getUserByEmail(email);
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code !== "auth/user-not-found") {
      // rethrow for any error other than user-not-found
      throw new Error(error.message);
    }
  }

  if (!userInFirebase) {
    userInFirebase = await tenantAuth.createUser({
      email,
    });
  }

  return userInFirebase;
}

export async function verifyEmailInFirebase(email: string) {
  const tenantAuth = getTenantFirebaseAuth();
  if (process.env.NODE_ENV === "test") {
    return true;
  }

  const userRecord = await tenantAuth.getUserByEmail(email);
  if (!userRecord.emailVerified) {
    await tenantAuth.updateUser(userRecord.uid, { emailVerified: true });
  }

  return true;
}

export async function generateMagicLink(email: string, url: string) {
  const emailQueryStr = `email=${encodeURIComponent(email)}`;

  const actionCodeSettings = {
    url: url.includes("?") ? `${url}&${emailQueryStr}` : `${url}?${emailQueryStr}`,
  };

  const tenantAuth = getTenantFirebaseAuth();
  if (process.env.NODE_ENV === "test") {
    return "https://foo.bar.baz";
  }

  const magicLink = await tenantAuth.generateSignInWithEmailLink(email, actionCodeSettings);
  return magicLink;
}

const bucket = admin.storage(app).bucket("bucket-name");

function appendUuidToFilename(filename: string): string {
  const match = filename.match(/\.([^.\\/:*?"<>|\r\n]+)$/);

  let base: string;
  let ext: string;

  if (match) {
    ext = match[1];
    base = filename.slice(0, match.index);
  } else {
    ext = '';
    base = filename;
  }

  if (!ext) {
    throw new Error("Filename must have an extension");
  }

  const uniqueId = crypto.randomUUID();
  return `${base}_${uniqueId}.${ext}`;
}

export async function saveFileToFirebase(filename: string, buffer: Buffer, contentType: string) {
  const filepath = `${APP_ENV}/uploads/${appendUuidToFilename(filename)}`;
  const bucketFile = bucket.file(filepath);

  if (process.env.NODE_ENV !== "test") {
    await bucketFile.save(buffer, {
      contentType,
    });
  }

  return filepath;
}

export async function downloadFileFromFirebase(relativeUrl: string) {
  if (process.env.NODE_ENV === "test") {
    return Buffer.from("20");
  }

  const bucketFile = bucket.file(relativeUrl);
  const [fileBuffer] = await bucketFile.download();
  return fileBuffer;
}

export function verifyIdToken(token: string) {
  return getTenantFirebaseAuth().verifyIdToken(token, true);
}
