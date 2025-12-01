declare global {
  namespace NodeJS {
    interface ProcessEnv {
      APP_ENV: string;
      DATABASE_URL: string;
      FIREBASE_SERVICE_ACCOUNT: string;
      GCP_TENANT_ID: string;
    }
  }
}

export {};
