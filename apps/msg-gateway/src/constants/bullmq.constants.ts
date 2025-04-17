// Use as const if you need compile-time immutability and strict typing.
// Use Object.freeze() if you need runtime immutability (e.g., preventing mutations in JavaScript).

import { MESSAGE, PERSIST, VECTORIZE } from './default.constants';

export const BULLMQ_CHAT_JOB = Object.freeze({
  PERSIST: process.env.BULLMQ_JOB_PERSIST ?? PERSIST,
  MESSAGE: process.env.BULLMQ_JOB_MESSAGE ?? MESSAGE,
  VECTORIZE: process.env.BULLMQ_JOB_VECTORIZE ?? VECTORIZE,
} as const);

export const BULLMQ_CHAT_QUEUE = Object.freeze({
  PERSIST: process.env.BULLMQ_QUEUE_PERSIST ?? PERSIST,
  MESSAGE: process.env.BULLMQ_QUEUE_MESSAGE ?? MESSAGE,
  VECTORIZE: process.env.BULLMQ_QUEUE_VECTORIZE ?? VECTORIZE,
} as const);
