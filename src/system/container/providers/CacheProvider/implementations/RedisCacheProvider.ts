import { inject, injectable } from 'tsyringe';

// Provider import
import { IInMemoryDatabaseProvider } from '../../InMemoryDatabaseProvider/models/IInMemoryDatabaseProvider';

// Interface import
import { ICacheProvider } from '../models/ICacheProvider';

@injectable()
class RedisCacheProvider implements ICacheProvider {
  constructor(
    @inject('InMemoryDatabaseProvider')
    private inMemoryDatabaseProvider: IInMemoryDatabaseProvider,
  ) {
    this.init();
  }

  private async init(): Promise<void> {
    await this.clearCache();
  }

  public async set(key: string, value: any, ttl?: number): Promise<void> {
    if (ttl) {
      await this.inMemoryDatabaseProvider.set(
        `cache:${key}`,
        JSON.stringify(value),
        'EX',
        ttl,
      );
    } else {
      await this.inMemoryDatabaseProvider.set(
        `cache:${key}`,
        JSON.stringify(value),
      );
    }
  }

  public async get<T>(key: string): Promise<T | null> {
    const data = await this.inMemoryDatabaseProvider.get(`cache:${key}`);

    if (!data) {
      return null;
    }

    const parsedData = JSON.parse(data) as T;

    return parsedData;
  }

  public async getPlain(key: string): Promise<string | null> {
    const data = await this.inMemoryDatabaseProvider.get(`cache:${key}`);

    if (!data) {
      return null;
    }

    return data;
  }

  public async invalidate(key: string): Promise<void> {
    await this.inMemoryDatabaseProvider.del(key);
  }

  public async invalidatePrefix(prefix: string): Promise<void> {
    const keys = await this.inMemoryDatabaseProvider.keys(`cache:${prefix}:*`);

    const pipeline = this.inMemoryDatabaseProvider.pipeline();

    keys.forEach((key) => {
      pipeline.del(key);
    });

    await pipeline.exec();
  }

  public async clearCache(): Promise<void> {
    const keys = await this.inMemoryDatabaseProvider.keys('cache:*');

    const pipeline = this.inMemoryDatabaseProvider.pipeline();

    keys.forEach((key) => {
      pipeline.del(key);
    });

    await pipeline.exec();
  }
}

export { RedisCacheProvider };
