import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache, CachingConfig } from 'cache-manager';

@Injectable()
export class CacheManagerService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  /**
   * Get value by key from cache manager
   *
   * @param key
   * @return value | undefined
   */
  async get(key: string): Promise<string | undefined> {
    return await this.cacheManager.get(key);
  }

  /**
   * Delete value by key in cache manager
   *
   * @param key
   * @return
   */
  async del(key: string): Promise<any> {
    await this.cacheManager.del(key);
  }

  /**
   * Set key value pair in cache manager
   *
   * @param  key: string,
   * @param value: string,
   * @param options?: CachingConfig,
   * @return
   */
  async set(
    key: string,
    value: string,
    options?: CachingConfig,
  ): Promise<string> {
    return await this.cacheManager.set(key, value, options);
  }
}
