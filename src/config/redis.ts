const redisConfig = {
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  username: process.env.REDIS_USER || undefined,
  password: process.env.REDIS_PASS || undefined,
  db: Number(process.env.REDIS_DB || 0),
};

export { redisConfig };
