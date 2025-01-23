export interface ICacheProvider {
  /**
   * Set a item in cache
   *
   * @param key the key of cache
   * @param value the value to be stringify
   * @param ttl in seconds (optional)
   */
  set(key: string, value: any, ttl?: number): Promise<void>;

  /**
   * Get item from cache
   *
   * @param key the key of cache
   */
  get<T>(key: string): Promise<T | null>;

  /**
   * Get plain item from cache
   *
   * @param key the key of cache
   */
  getPlain(key: string): Promise<string | null>;

  /**
   * Remove a item from cache
   *
   * @param key the key of cache
   */
  invalidate(key: string): Promise<void>;

  /**
   * Remove all items with provided prefix on cache
   *
   * @param prefix prefix of cache items
   */
  invalidatePrefix(prefix: string): Promise<void>;

  /**
   * Clear all items in cache
   */
  clearCache(): Promise<void>;
}
