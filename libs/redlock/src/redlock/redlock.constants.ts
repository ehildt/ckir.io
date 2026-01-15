import { RedisOptions } from 'ioredis';
import { Settings } from 'redlock';

export const REDLOCK = Symbol('REDLOCK');
export const REDLOCK_SETTINGS = Symbol('REDLOCK_SETTINGS');
export const REDIS_CLIENT = Symbol('REDIS_CLIENT');
export const REDIS_OPTIONS = Symbol('REDIS_OPTIONS');

export const REDLOCK_DEFAULTS: Settings = {
  retryCount: 3,
  retryDelay: 200,
  retryJitter: 100,
  driftFactor: 0.01,
  automaticExtensionThreshold: 500,
};

export const REDLOCK_REDIS_DEFAULTS: RedisOptions = {};
