declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // General
      APP_URL: string;
      APP_PORT: number;
      NODE_ENV: string;
      DEFAULT_LANGUAGE: string;
      TZ: string;

      // Cors
      CORS_ALLOWED_FROM: string;

      // Database
      DATABASE_URL: string;
      DATABASE_LOGGER_ENABLED: string;

      // Redis
      REDIS_HOST: string;
      REDIS_PORT: number;
      REDIS_USER?: string;
      REDIS_PASS?: string;
      REDIS_DB?: number;
    }
  }
}

export {};
