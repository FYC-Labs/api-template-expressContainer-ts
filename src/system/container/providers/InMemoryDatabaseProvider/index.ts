import { container } from 'tsyringe';

// Interface import
import { IInMemoryDatabaseProvider } from './models/IInMemoryDatabaseProvider';

// Provider import
import {
  RedisInMemoryDatabaseProvider,
  redisDatabaseConnection,
} from './implementations/RedisInMemoryDatabaseProvider';

const providers = {
  redis: RedisInMemoryDatabaseProvider,
};

const InMemoryDatabaseProvider = providers.redis;
const InMemoryDatabaseProviderInitialization = redisDatabaseConnection;

container.registerInstance<IInMemoryDatabaseProvider>(
  'InMemoryDatabaseProvider',
  InMemoryDatabaseProvider,
);

export { InMemoryDatabaseProvider, InMemoryDatabaseProviderInitialization };
