import { DynamicModule, Module, Provider } from '@nestjs/common';
import Redis from 'ioredis';
import Redlock from 'redlock';

import { REDIS_CLIENT, REDLOCK } from './redlock.constants';
import { RedlockModuleProps } from './redlock.model';
import { RedlockService } from './redlock.service';

@Module({})
export class RedlockModule {
  /**
   * Async registration for RedlockModule. \
   * Accepts async factories for Redis options and Redlock settings.
   */
  static registerAsync(options: RedlockModuleProps): DynamicModule {
    const redisProvider: Provider = {
      provide: REDIS_CLIENT,
      inject: options.injectRedisOptions ?? [],
      useFactory: async (...deps: unknown[]) => {
        const redisOptions = await options.useRedisFactory(...deps);
        return new Redis(redisOptions);
      },
    };

    const redlockProvider: Provider = {
      provide: REDLOCK,
      inject: [REDIS_CLIENT, ...(options.injectRedlockSettings ?? [])],
      useFactory: async (redis: Redis, ...deps: unknown[]) => {
        const settings = await options.useRedlockSettingsFactory(...deps);
        return new Redlock([redis], settings);
      },
    };

    return {
      module: RedlockModule,
      global: options.global ?? false,
      providers: [redisProvider, redlockProvider, RedlockService],
      exports: [redlockProvider, RedlockService],
    };
  }
}
