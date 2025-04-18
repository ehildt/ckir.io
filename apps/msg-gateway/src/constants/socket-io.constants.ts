import { BULLMQ_DEFAULT } from './default.constants';

export const SOCKET_IO_EVENT = Object.freeze({
  MESSAGE: process.env.SOCKET_IO_EVENT_NAME ?? BULLMQ_DEFAULT.MESSAGE,
} as const);
