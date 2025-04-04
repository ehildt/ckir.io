import Joi from 'joi';

import { BULLMQ_CHAT_JOB, BULLMQ_CHAT_QUEUE } from '@/archive/constants /bullmq.constants';

import { getBooleanEnv, getNumberEnv } from './config-factory.helpers';
import { AppConfig, BullMQArgs, BullMQConfig } from './config-factory.model';

const ALLOWED_IP_VERSIONS = { version: ['ipv4', 'ipv6'] };

export const AppConfigSchema = Joi.object<AppConfig>({
  printConfig: Joi.boolean().required(),
  enableSwagger: Joi.boolean().required(),
  enableREST: Joi.boolean().required(),
  bodyLimit: Joi.number().min(1).required(),
  address: Joi.string().ip(ALLOWED_IP_VERSIONS).required(),
  port: Joi.number().integer().min(1).max(65535).required(),
  nodeEnv: Joi.string().valid('development', 'production', 'test', 'local').required(),
  cors: Joi.object({
    origin: Joi.string().optional(),
    methods: Joi.string().optional(),
    preflightContinue: Joi.boolean().optional(),
    optionsSuccessStatus: Joi.number().optional(),
    credentials: Joi.boolean().optional(),
    allowedHeaders: Joi.string().allow(null).optional(),
  }).optional(),
});

export function AppConfigAdapter(): AppConfig {
  return {
    address: process.env.ADDRESS,
    nodeEnv: process.env.NODE_ENV,
    port: getNumberEnv(process.env.PORT),
    bodyLimit: getNumberEnv(process.env.BODY_LIMIT),
    printConfig: getBooleanEnv(process.env.PRINT_CONFIG),
    enableSwagger: getBooleanEnv(process.env.ENABLE_SWAGGER),
    enableREST: getBooleanEnv(process.env.ENABLE_REST),
    cors: process.env.CORS_ORIGIN
      ? {
          origin: process.env.CORS_ORIGIN,
          methods: process.env.CORS_METHODS,
          preflightContinue: getBooleanEnv(process.env.CORS_PREFLIGHT_CONTINUE),
          optionsSuccessStatus: getNumberEnv(process.env.CORS_OPTIONS_SUCCESS_STATUS),
          credentials: getBooleanEnv(process.env.CORS_CREDENTIALS),
          allowedHeaders: process.env.CORS_ALLOWED_HEADERS ?? null,
        }
      : null,
  };
}

export const BullMQConfigArgsSchema = Joi.object<BullMQArgs>({
  jobPersist: Joi.string().min(1).required(),
  jobMessage: Joi.string().min(1).required(),
  jobVectorize: Joi.string().min(1).required(),
  queuePersist: Joi.string().min(1).required(),
  queueMessage: Joi.string().min(1).required(),
  queueVectorize: Joi.string().min(1).required(),
});

export function BullMQConfigArgsAdapter(): BullMQArgs {
  return {
    jobPersist: process.env.BULLMQ_JOB_PERSIST ?? BULLMQ_CHAT_JOB.PERSIST,
    jobVectorize: process.env.BULLMQ_JOB_VECTORIZE ?? BULLMQ_CHAT_JOB.VECTORIZE,
    jobMessage: process.env.BULLMQ_JOB_MESSAGE ?? BULLMQ_CHAT_JOB.MESSAGE,
    queuePersist: process.env.BULLMQ_QUEUE_PERSIST ?? BULLMQ_CHAT_QUEUE.PERSIST,
    queueMessage: process.env.BULLMQ_QUEUE_MESSAGE ?? BULLMQ_CHAT_QUEUE.MESSAGE,
    queueVectorize: process.env.BULLMQ_QUEUE_VECTORIZE ?? BULLMQ_CHAT_QUEUE.VECTORIZE,
  };
}

export const BullMQConfigSchema = Joi.object<BullMQConfig>({
  defaultJobOptions: Joi.object({
    delay: Joi.number().min(0).required(),
    lifo: Joi.boolean().required(),
    priority: Joi.number().min(0).required(),
    attempts: Joi.number().min(1).max(50).required(),
    stackTraceLimit: Joi.number().min(1).required(),
    removeOnComplete: Joi.boolean().required(),
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
    host: Joi.string().hostname().required(),
    password: Joi.string().allow('').optional(),
    username: Joi.string().allow('').optional(),
    port: Joi.number().min(1).max(65535).required(),
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

export function BullMQConfigAdapter(): BullMQConfig {
  return {
    defaultJobOptions: {
      delay: getNumberEnv(process.env.BULLMQ_JOB_DELAY, 0), // Initial delay before processing job
      lifo: getBooleanEnv(process.env.BULLMQ_JOB_LIFO, false), // FIFO processing (set to true for LIFO behavior)
      priority: getNumberEnv(process.env.BULLMQ_JOB_PRIORITY, 0), // Lower number means higher priority (set if you use priority queues)
      attempts: getNumberEnv(process.env.BULLMQ_JOB_ATTEMPTS, 7), // Maximum retry attempts
      stackTraceLimit: getNumberEnv(process.env.BULLMQ_JOB_STACK_TRACE_LIMIT, 10), // Retain stack traces for debugging
      removeOnComplete: getBooleanEnv(process.env.BULLMQ_REMOVE_ON_COMPLETE, true), // Cleanup after success
      removeOnFail: {
        age: getNumberEnv(process.env.BULLMQ_REMOVE_ON_FAIL_AGE, 604_800_000), // Keep failed jobs for 7 days
        count: getNumberEnv(process.env.BULLMQ_REMOVE_ON_FAIL_COUNT, 1_000), // Keep only last 1,000 failed jobs
      },
      backoff: {
        type: process.env.BULLMQ_BACKOFF_TYPE ?? 'exponential',
        delay: getNumberEnv(process.env.BULLMQ_BACKOFF_DELAY, 500),
      },
    },
    connection: {
      host: process.env.BULLMQ_HOST ?? 'localhost',
      port: getNumberEnv(process.env.BULLMQ_PORT, 6379),
      username: process.env.BULLMQ_USER ?? 'default',
      password: process.env.BULLMQ_PASS ?? '',
      tls: getBooleanEnv(process.env.BULLMQ_USE_TLS)
        ? {
            passphrase: process.env.BULLMQ_PASSPHRASE,
            rejectUnauthorized: getBooleanEnv(process.env.BULLMQ_TLS_REJECT_UNAUTHORIZED),
            ca: Buffer.from(process.env.BULLMQ_TLS_CA, 'base64'),
            cert: Buffer.from(process.env.BULLMQ_TLS_CERT, 'base64'),
            key: Buffer.from(process.env.BULLMQ_TLS_KEY, 'base64'),
          }
        : null,
    },
  };
}
