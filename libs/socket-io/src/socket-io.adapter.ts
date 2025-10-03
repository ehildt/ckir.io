import { getBooleanEnv, getNumberEnv } from '@ckir.io/helpers';

import { SOCKET_IO_EVENT_TYPE } from './socket-io.constants';
import { SocketIOConfig } from './socket-io.model';

export function SocketIOAdapter(EVENT: SOCKET_IO_EVENT_TYPE): SocketIOConfig {
  return {
    event: EVENT,
    port: getNumberEnv(process.env.SOCKET_IO_PORT),
    opts: {
      maxHttpBufferSize: getNumberEnv(
        process.env.SOCKET_IO_MAX_HTTP_BUFFER_SIZE,
        262_144,
      ),
      cleanupEmptyChildNamespaces: getBooleanEnv(
        process.env.SOCKET_IO_CLEANUP_EMPTY_CHILD_NAMESPACES,
        false,
      ),
      transports: (process.env.SOCKET_IO_TRANSPORTS?.split(',') as any) || [
        'websocket',
        'polling',
        'webtransport',
      ],
      connectTimeout: getNumberEnv(
        process.env.SOCKET_IO_CONNECT_TIMEOUT,
        30_000,
      ),
      pingInterval: getNumberEnv(process.env.SOCKET_IO_PING_INTERVAL, 25_000),
      pingTimeout: getNumberEnv(process.env.SOCKET_IO_PING_TIMEOUT, 5_000),
      allowEIO3: getBooleanEnv(process.env.SOCKET_IO_ALLOW_EIO3, false),
      cors: {
        origin: process.env.SOCKET_IO_CORS_ORIGIN || '*',
        credentials: getBooleanEnv(
          process.env.SOCKET_IO_CORS_CREDENTIALS,
          true,
        ),
        methods: process.env.SOCKET_IO_CORS_METHODS?.split(',') || [
          'GET',
          'POST',
        ],
      },
    },
  };
}
