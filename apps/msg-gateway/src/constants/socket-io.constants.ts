import { MESSAGE } from './default.constants';

export const SOCKET_IO_EVENT = Object.freeze({
  MESSAGE: process.env.SOCKET_IO_EVENT_NAME ?? MESSAGE,
} as const);
