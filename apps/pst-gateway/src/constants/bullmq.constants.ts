// Use as const if you need compile-time immutability and strict typing.
// Use Object.freeze() if you need runtime immutability (e.g., preventing mutations in JavaScript).

import { BULLMQ_DEFAULT } from './default.constants';

export const BULLMQ_JOB = Object.freeze({
  PERSIST: process.env.BULLMQ_JOB_PERSIST ?? BULLMQ_DEFAULT.PERSIST,
  MESSAGE: process.env.BULLMQ_JOB_MESSAGE ?? BULLMQ_DEFAULT.MESSAGE,
  VECTORIZE: process.env.BULLMQ_JOB_VECTORIZE ?? BULLMQ_DEFAULT.VECTORIZE,
} as const);

export const BULLMQ_QUEUE = Object.freeze({
  PERSIST_TOPIC: process.env.BULLMQ_QUEUE_PERSIST_TOPIC ?? BULLMQ_DEFAULT.PERSIST_TOPIC,
  PERSIST_THREAD: process.env.BULLMQ_QUEUE_PERSIST_THREAD ?? BULLMQ_DEFAULT.PERSIST_THREAD,
  PERSIST_MESSAGE: process.env.BULLMQ_QUEUE_PERSIST_MESSAGE ?? BULLMQ_DEFAULT.PERSIST_MESSAGE,
  BROADCAST_MESSAGE: process.env.BULLMQ_QUEUE_BROADCAST_MESSAGE ?? BULLMQ_DEFAULT.BROADCAST_MESSAGE,
  VECTORIZE_MESSAGE: process.env.BULLMQ_QUEUE_VECTORIZE_MESSAGE ?? BULLMQ_DEFAULT.VECTORIZE_MESSAGE,
} as const);
