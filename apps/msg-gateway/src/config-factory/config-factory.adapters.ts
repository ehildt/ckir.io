import Joi from 'joi';
import pino from 'pino';

import { BULLMQ_JOB, BULLMQ_QUEUE } from '@/constants/bullmq.constants';
import { SOCKET_IO_EVENT } from '@/constants/socket-io.constants';

import { getBooleanEnv, getNumberEnv } from './config-factory.helpers';
import { AppConfig, BullMQArgs, BullMQConfig, SocketIOConfig } from './config-factory.model';

const ALLOWED_IP_VERSIONS = { version: ['ipv4', 'ipv6'] };

export const AppConfigSchema = Joi.object<AppConfig>({
  printConfig: Joi.boolean().required(),
  enableSwagger: Joi.boolean().required(),
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
    jobPersist: process.env.BULLMQ_JOB_PERSIST ?? BULLMQ_JOB.PERSIST,
    jobVectorize: process.env.BULLMQ_JOB_VECTORIZE ?? BULLMQ_JOB.VECTORIZE,
    jobMessage: process.env.BULLMQ_JOB_MESSAGE ?? BULLMQ_JOB.MESSAGE,
    queuePersist: process.env.BULLMQ_QUEUE_PERSIST_MESSAGE ?? BULLMQ_QUEUE.PERSIST_MESSAGE,
    queueMessage: process.env.BULLMQ_QUEUE_BROADCAST_MESSAGE ?? BULLMQ_QUEUE.BROADCAST_MESSAGE,
    queueVectorize: process.env.BULLMQ_QUEUE_VECTORIZE_MESSAGE ?? BULLMQ_QUEUE.VECTORIZE_MESSAGE,
  };
}

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
      removeOnComplete: {
        age: getNumberEnv(process.env.BULLMQ_REMOVE_ON_COMPLETED_AGE, 604_800_000), // Keep failed jobs for 7 days
        count: getNumberEnv(process.env.BULLMQ_REMOVE_ON_COMPLETED_COUNT, 1_000), // Keep only last 1,000 failed jobs
      },
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

export const SocketIOConfigSchema = Joi.object<SocketIOConfig>({
  event: Joi.string().optional(),
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
    event: process.env.SOCKET_IO_EVENT_NAME ?? SOCKET_IO_EVENT.MESSAGE,
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

export const PinoLoggerConfigSchema = Joi.object({
  level: Joi.string().valid('fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent').default('info'),
  base: Joi.string().allow(null).default(null),
  timestamp: Joi.func().required(),
  transport: Joi.object({
    target: Joi.string().valid('pino-pretty').default('pino-pretty'),
    options: Joi.object({
      translateTime: Joi.string().default('yyyy-mm-dd HH:MM:ss.l'),
      colorize: Joi.boolean().default(true),
      ignore: Joi.string().default('pid,hostname'),
    }).required(),
  }).required(),
});

export function PinoAdapter(): pino.LoggerOptions {
  return {
    level: process.env.BULLMQ_LOG_LEVEL ?? 'info',
    base: undefined,
    timestamp: pino.stdTimeFunctions.isoTime,
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'yyyy-mm-dd HH:MM:ss.l',
        colorize: true,
        ignore: 'pid,hostname',
      },
    },
  };
}
