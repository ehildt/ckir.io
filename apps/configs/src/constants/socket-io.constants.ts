import { BULLMQ_DEFAULT } from './default.constants';

export const SOCKET_IO_EVENT = Object.freeze({
  TOPIC: process.env.SOCKET_IO_EVENT_NAME ?? BULLMQ_DEFAULT.TOPIC,
  THREAD: process.env.SOCKET_IO_EVENT_NAME ?? BULLMQ_DEFAULT.THREAD,
  MESSAGE: process.env.SOCKET_IO_EVENT_NAME ?? BULLMQ_DEFAULT.MESSAGE,
} as const);
