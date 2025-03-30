import Joi from 'joi';

import { BULLMQ_CHAT_JOB, BULLMQ_CHAT_QUEUE } from '@/chat/constants/bullmq.constants';

import { getBooleanEnv, getNumberEnv } from './config-factory.helpers';
import { AppConfig, BullMQArgs, BullMQConfig, SocketIOConfig } from './config-factory.model';

const ALLOWED_IP_VERSIONS = { version: ['ipv4', 'ipv6'] };

export const AppConfigSchema = Joi.object<AppConfig>({
  printConfig: Joi.boolean().required(),
  enableSwagger: Joi.boolean().required(),
  enableREST: Joi.boolean().required(),
  bodyLimit: Joi.number().min(1).required(),
  address: Joi.string().ip(ALLOWED_IP_VERSIONS).required(),
  port: Joi.number().integer().min(1).max(65535).required(),
  nodeEnv: Joi.string().valid('development', 'production', 'test', 'local').required(),
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
      // ! TODO tls support
    },
  };
}

export const SocketIOConfigSchema = Joi.object<SocketIOConfig>({
  port: Joi.number().required(),
  opts: Joi.object({
    cleanupEmptyChildNamespaces: Joi.boolean().required(),
    maxHttpBufferSize: Joi.number().required(),
    pingInterval: Joi.number().required(),
    pingTimeout: Joi.number().required(),
    allowEIO3: Joi.boolean().required(),
    transports: Joi.array()
      .items(Joi.string().valid('websocket', 'polling', 'webtransport'))
      .required(),
    cors: Joi.object({
      origin: Joi.string().allow('*').required(),
      credentials: Joi.boolean().required(),
      methods: Joi.array().items(Joi.string().valid('GET', 'POST')).required(),
    }).required(),
  }).required(),
});

export function SocketIOAdapter(): SocketIOConfig {
  return {
    port: getNumberEnv(process.env.SOCKET_IO_PORT),
    opts: {
      maxHttpBufferSize: getNumberEnv(process.env.SOCKET_IO_MAX_HTTP_BUFFER_SIZE, 262_144),
      cleanupEmptyChildNamespaces: getBooleanEnv(process.env.SOCKET_IO_CLEANUP_EMPTY_CHILD_NAMESPACES, false),
      transports: (process.env.SOCKET_IO_TRANSPORTS?.split(',') as any) || ['websocket', 'polling', 'webtransport'],
      pingInterval: getNumberEnv(process.env.SOCKET_IO_PING_INTERVAL, 25_000),
      pingTimeout: getNumberEnv(process.env.SOCKET_IO_PING_TIMEOUT, 5_000),
      allowEIO3: getBooleanEnv(process.env.SOCKET_IO_ALLOW_EIO3, false),
      cors: {
        origin: process.env.SOCKET_IO_CORS_ORIGIN || '*',
        credentials: getBooleanEnv(process.env.SOCKET_IO_CORS_CREDENTIALS, true),
        methods: process.env.SOCKET_IO_CORS_METHODS?.split(',') || ['GET', 'POST'],
      },
    },
  };
}
