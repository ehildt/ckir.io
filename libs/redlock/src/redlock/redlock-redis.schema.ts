import { RedisOptions } from 'ioredis';
import Joi from 'joi';

export const RedlockRedisOptionsSchema = Joi.object<RedisOptions>({
  host: Joi.string().hostname().required(),
  port: Joi.number().integer().min(1).max(65535).default(6379),
  username: Joi.string().allow('').optional(),
  password: Joi.string().allow('').optional(),
  connectTimeout: Joi.number().integer().min(1000).optional(),
  commandTimeout: Joi.number().integer().min(1000).optional(),
  tls: Joi.object({
    rejectUnauthorized: Joi.boolean().required(),
    ca: Joi.binary().optional(),
    cert: Joi.binary().required(),
    key: Joi.binary().required(),
    passphrase: Joi.string().optional(),
  })
    .optional()
    .allow(null),
});
