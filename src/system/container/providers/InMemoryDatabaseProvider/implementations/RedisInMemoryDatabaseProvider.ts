import Redis from 'ioredis';

// Util import
import { redisConfig } from '@config/redis';
import { executeAction } from '../../../../util/executeAction';

// Config import

const RedisInMemoryDatabaseProvider = new Redis({
  host: redisConfig.host,
  port: redisConfig.port,
  username: redisConfig.username,
  password: redisConfig.password,
  db: redisConfig.db,
  lazyConnect: true,
});

const redisDatabaseConnection = executeAction({
  action: () => RedisInMemoryDatabaseProvider.connect(),
  actionName: 'Redis connection',
});

RedisInMemoryDatabaseProvider.on('error', message =>
  console.log(`❌ Redis error: "${message}"`),
);

RedisInMemoryDatabaseProvider.on('error', () =>
  console.log(`❌ Redis disconnected`),
);

export { RedisInMemoryDatabaseProvider, redisDatabaseConnection };
