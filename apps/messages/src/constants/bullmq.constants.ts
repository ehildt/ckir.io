// Use as const if you need compile-time immutability and strict typing.
// Use Object.freeze() if you need runtime immutability (e.g., preventing mutations in JavaScript).

export const BULLMQ_JOB = Object.freeze({
  PERSIST: 'PERSIST',
  DISPATCH: 'DISPATCH',
  VECTORIZE: 'VECTORIZE',
} as const);

export const BULLMQ_QUEUE = Object.freeze({
  PERSIST_MESSAGE: 'PERSIST_MESSAGE',
  BROADCAST_MESSAGE: 'BROADCAST_MESSAGE',
  VECTORIZE_MESSAGE: 'VECTORIZE_MESSAGE',
} as const);
