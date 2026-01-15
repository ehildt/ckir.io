import { RedisOptions } from 'ioredis';
import { Settings } from 'redlock';

export type RedlockModuleProps = {
  global?: boolean;
  injectRedisOptions: Array<any>;
  useRedisFactory: (...deps: Array<any>) => Promise<RedisOptions>;
  injectRedlockSettings: Array<any>;
  useRedlockSettingsFactory: (...deps: Array<any>) => Promise<Settings>;
};
