// Use as const if you need compile-time immutability and strict typing.
// Use Object.freeze() if you need runtime immutability (e.g., preventing mutations in JavaScript).

import { BULLMQ_DEFAULT } from './default.constants';

export const BULLMQ_JOB = Object.freeze({
  PERSIST: BULLMQ_DEFAULT.PERSIST,
} as const);

export const BULLMQ_QUEUE = Object.freeze({
  PERSIST_TOPICS: BULLMQ_DEFAULT.PERSIST_TOPICS,
  PERSIST_THREADS: BULLMQ_DEFAULT.PERSIST_THREADS,
  PERSIST_POSTS: BULLMQ_DEFAULT.PERSIST_POSTS,
} as const);
