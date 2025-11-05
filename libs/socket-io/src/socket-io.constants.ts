export const SOCKET_IO_SERVER = Symbol('SOCKET.IO');

export type SOCKET_IO_EVENT_TYPE = 'topic' | 'thread' | 'post' | 'vision';

export const SOCKET_IO_EVENT = Object.freeze({
  TOPIC: 'topic' as SOCKET_IO_EVENT_TYPE,
  THREAD: 'thread' as SOCKET_IO_EVENT_TYPE,
  POST: 'post' as SOCKET_IO_EVENT_TYPE,
  VISION: 'vision' as SOCKET_IO_EVENT_TYPE,
});
