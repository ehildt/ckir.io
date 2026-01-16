import { RedisOptions } from 'ioredis';
import { Settings } from 'redlock';

export type RedlockOptions = {
  redisOptions: RedisOptions;
  redlockSettings: Settings;
};

export type RedlockModuleProps = {
  global?: boolean;
  inject: Array<any>;
  useFactory: (...deps: Array<any>) => Promise<RedlockOptions>;
};
