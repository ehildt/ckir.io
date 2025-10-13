import { getBooleanEnv, getNumberEnv } from '@ckir.io/helpers';

import { BullMQConfig } from '../bullmq/bullmq.model';

export function BullMQConfigAdapter(): BullMQConfig {
  return {
    defaultJobOptions: {
      delay: getNumberEnv(process.env.BULLMQ_JOB_DELAY, 0), // Initial delay before processing job
      lifo: getBooleanEnv(process.env.BULLMQ_JOB_LIFO, false), // FIFO processing (set to true for LIFO behavior)
      priority: getNumberEnv(process.env.BULLMQ_JOB_PRIORITY, 0), // Lower number means higher priority (set if you use priority queues)
      attempts: getNumberEnv(process.env.BULLMQ_JOB_ATTEMPTS, 7), // Maximum retry attempts
      stackTraceLimit: getNumberEnv(
        process.env.BULLMQ_JOB_STACK_TRACE_LIMIT,
        10,
      ), // Retain stack traces for debugging
      removeOnComplete: {
        age: getNumberEnv(
          process.env.BULLMQ_REMOVE_ON_COMPLETED_AGE,
          604_800_000,
        ), // Keep failed jobs for 7 days
        count: getNumberEnv(
          process.env.BULLMQ_REMOVE_ON_COMPLETED_COUNT,
          1_000,
        ), // Keep only last 1,000 failed jobs
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
      enableReadyCheck: getBooleanEnv(
        process.env.BULLMQ_ENABLE_READY_CHECK,
        false,
      ),
      host: process.env.BULLMQ_HOST ?? 'localhost',
      port: getNumberEnv(process.env.BULLMQ_PORT, 6379),
      username: process.env.BULLMQ_USER ?? 'default',
      password: process.env.BULLMQ_PASS ?? 'redis',
      connectTimeout: getNumberEnv(process.env.BULLMQ_CONNECT_TIMEOUT, 30_000),
      commandTimeout: getNumberEnv(process.env.BULLMQ_COMMAND_TIMEOUT, 30_000),
      retryStrategy: (times: number) => Math.min(times * 200, 2000),
      tls: getBooleanEnv(process.env.BULLMQ_USE_TLS)
        ? {
            passphrase: process.env.BULLMQ_PASSPHRASE,
            rejectUnauthorized: getBooleanEnv(
              process.env.BULLMQ_TLS_REJECT_UNAUTHORIZED,
            ),
            ca: Buffer.from(process.env.BULLMQ_TLS_CA, 'base64'),
            cert: Buffer.from(process.env.BULLMQ_TLS_CERT, 'base64'),
            key: Buffer.from(process.env.BULLMQ_TLS_KEY, 'base64'),
          }
        : null,
    },
  };
}
