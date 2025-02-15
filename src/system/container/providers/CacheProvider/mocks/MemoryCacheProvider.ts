// Interface import
import { ICacheProvider } from '../models/ICacheProvider';

// Interfaces
interface ICacheData {
  [key: string]: string;
}

class MemoryCacheProvider implements ICacheProvider {
  private cache: ICacheData = {};

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public async set(key: string, value: any, _?: number): Promise<void> {
    this.cache[`cache:${key}`] = JSON.stringify(value);
  }

  public async get<T>(key: string): Promise<T | null> {
    const data = this.cache[`cache:${key}`];

    if (!data) {
      return null;
    }

    const parsedData = JSON.parse(data) as T;

    return parsedData;
  }

  public async getPlain(key: string): Promise<string | null> {
    const data = this.cache[`cache:${key}`];

    if (!data) {
      return null;
    }

    return data;
  }

  public async invalidate(key: string): Promise<void> {
    delete this.cache[`cache:${key}`];
  }

  public async invalidatePrefix(prefix: string): Promise<void> {
    const keys = Object.keys(this.cache).filter((key) => key.startsWith(`cache:${prefix}`));

    keys.forEach((key) => {
      delete this.cache[key];
    });
  }

  public async clearCache(): Promise<void> {
    const keys = Object.keys(this.cache).filter((key) => key.startsWith('cache:'));

    keys.forEach((key) => {
      delete this.cache[key];
    });
  }
}

export { MemoryCacheProvider };
