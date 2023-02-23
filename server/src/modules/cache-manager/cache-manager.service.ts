/*
 Copyright (c) 2023, Xgrid Inc, http://xgrid.co

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

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
