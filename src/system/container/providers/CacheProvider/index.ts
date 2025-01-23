import { container } from 'tsyringe';

// Interface import
import { ICacheProvider } from './models/ICacheProvider';

// Provider import
import { RedisCacheProvider } from './implementations/RedisCacheProvider';

const providers = {
  redis: container.resolve(RedisCacheProvider),
};

container.registerInstance<ICacheProvider>('CacheProvider', providers.redis);
