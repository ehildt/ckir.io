import { getNumberEnv } from '@ehildt/ckir-helpers';
import { Settings } from 'redlock';

import { REDLOCK_DEFAULTS } from './redlock.constants';

function loadRedlockEnv(): Partial<Settings> {
  return {
    retryCount: getNumberEnv(process.env.REDLOCK_RETRY_COUNT),
    retryDelay: getNumberEnv(process.env.REDLOCK_RETRY_DELAY),
    retryJitter: getNumberEnv(process.env.REDLOCK_RETRY_JITTER),
    driftFactor: getNumberEnv(process.env.REDLOCK_DRIFT_FACTOR),
    automaticExtensionThreshold: getNumberEnv(
      process.env.REDLOCK_AUTOMATIC_EXTENSION_THRESHOLD,
    ),
  };
}

/**
 * Returns fully resolved Redlock settings,
 * merging defaults, environment variables, and any overrides.
 */
export function RedlockAdapter(settings: Partial<Settings> = {}): Settings {
  return {
    ...REDLOCK_DEFAULTS,
    ...loadRedlockEnv(),
    ...settings,
  };
}
