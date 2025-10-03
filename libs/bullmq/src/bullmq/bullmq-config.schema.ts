import Joi from 'joi';

import { BullMQConfig } from '../bullmq/bullmq.model';

export const BullMQConfigSchema = Joi.object<BullMQConfig>({
  defaultJobOptions: Joi.object({
    delay: Joi.number().min(0).required(),
    lifo: Joi.boolean().required(),
    priority: Joi.number().min(0).required(),
    attempts: Joi.number().min(1).max(50).required(),
    stackTraceLimit: Joi.number().min(1).required(),
    removeOnComplete: Joi.object({
      age: Joi.number().default(604_800), // 7 days
      count: Joi.number().default(1000),
    }).required(),
    removeOnFail: Joi.object({
      age: Joi.number().min(0).required(),
      count: Joi.number().min(0).required(),
    }).required(),
    backoff: Joi.object({
      type: Joi.string().valid('exponential', 'fixed').required(),
      delay: Joi.number().min(0).required(),
    }).required(),
  }).required(),
  connection: Joi.object({
    enableReadyCheck: Joi.boolean().default(false),
    host: Joi.string().hostname().required(),
    password: Joi.string().allow('').optional(),
    username: Joi.string().allow('').optional(),
    port: Joi.number().min(1).max(65535).required(),
    commandTimeout: Joi.number().min(1000).optional(),
    retryStrategy: Joi.any().optional(),
    tls: Joi.object({
      rejectUnauthorized: Joi.boolean().required(),
      ca: Joi.binary().optional(),
      cert: Joi.binary().required(),
      key: Joi.binary().required(),
      passphrase: Joi.string().optional(),
    })
      .optional()
      .allow(null),
  }).required(),
});
