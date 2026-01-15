import { getBooleanEnv, getNumberEnv } from '@ehildt/ckir-helpers';
import { RedisOptions } from 'ioredis';

import { REDLOCK_REDIS_DEFAULTS } from './redlock.constants';

function loadRedlockRedisEnv(): Partial<RedisOptions> {
  const useTls = getBooleanEnv(process.env.REDLOCK_TLS, false);

  return {
    host: process.env.REDLOCK_HOST ?? undefined,
    port: getNumberEnv(process.env.REDLOCK_PORT, 6379),
    username: process.env.REDLOCK_USERNAME ?? undefined,
    password: process.env.REDLOCK_PASSWORD ?? undefined,
    commandTimeout: getNumberEnv(process.env.REDLOCK_COMMAND_TIMEOUT),
    connectTimeout: getNumberEnv(process.env.REDLOCK_CONNECT_TIMEOUT),
    tls: useTls
      ? {
          passphrase: process.env.REDLOCK_PASSPHRASE ?? undefined,
          rejectUnauthorized: getBooleanEnv(
            process.env.REDLOCK_TLS_REJECT_UNAUTHORIZED,
          ),
          ca: process.env.REDLOCK_TLS_CA
            ? Buffer.from(process.env.REDLOCK_TLS_CA, 'base64')
            : undefined,
          cert: process.env.REDLOCK_TLS_CERT
            ? Buffer.from(process.env.REDLOCK_TLS_CERT, 'base64')
            : undefined,
          key: process.env.REDLOCK_TLS_KEY
            ? Buffer.from(process.env.REDLOCK_TLS_KEY, 'base64')
            : undefined,
        }
      : undefined,
  };
}

/**
 * Returns fully resolved RedisOptions for Redlock,
 * merging defaults, environment variables, and any overrides.
 */
export function RedlockRedisAdapter(
  settings: Partial<RedisOptions> = {},
): RedisOptions {
  return {
    ...REDLOCK_REDIS_DEFAULTS,
    ...loadRedlockRedisEnv(),
    ...settings,
  };
}
