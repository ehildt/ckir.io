// Use as const if you need compile-time immutability and strict typing.
// Use Object.freeze() if you need runtime immutability (e.g., preventing mutations in JavaScript).

export const BULLMQ_JOB = Object.freeze({
  VECTORIZE: 'VECTORIZE',
} as const);

export const BULLMQ_QUEUE = Object.freeze({
  VECTORIZE_TOPIC: 'VECTORIZE_TOPIC',
  VECTORIZE_THREAD: 'VECTORIZE_THREAD',
  VECTORIZE_POSTS: 'VECTORIZE_POST',
} as const);
