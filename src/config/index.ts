import "dotenv/config";

export const CORS_CONFIG = {
  origin: '*',
};

export const ENV = {
  APP_ENV: process.env.APP_ENV,
  DATABASE_URL: process.env.DATABASE_URL,
  FIREBASE_SERVICE_ACCOUNT: JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || "{}"),
  GCP_TENANT_ID: process.env.GCP_TENANT_ID,
}
