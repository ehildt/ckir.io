import Joi from 'joi';

import { REDLOCK_DEFAULTS } from './redlock.constants';

export const RedlockSettingsSchema = Joi.object({
  retryCount: Joi.number()
    .integer()
    .min(0)
    .default(REDLOCK_DEFAULTS.retryCount),
  retryDelay: Joi.number()
    .integer()
    .min(0)
    .default(REDLOCK_DEFAULTS.retryDelay),
  retryJitter: Joi.number()
    .integer()
    .min(0)
    .default(REDLOCK_DEFAULTS.retryJitter),
  driftFactor: Joi.number().positive().default(REDLOCK_DEFAULTS.driftFactor),
  automaticExtensionThreshold: Joi.number()
    .integer()
    .min(0)
    .default(REDLOCK_DEFAULTS.automaticExtensionThreshold),
});
