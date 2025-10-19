process.env.ADDRESS = '127.0.0.1';
process.env.NODE_ENV = 'development';
process.env.PORT = '3000';
process.env.BODY_LIMIT = '1024';
process.env.LOG_LEVEL = 'warn';
process.env.PRINT_CONFIG = 'true';
process.env.ENABLE_SWAGGER = 'false';
process.env.CORS_ORIGIN = 'https://example.com';
process.env.CORS_METHODS = 'GET,POST';
process.env.CORS_PREFLIGHT_CONTINUE = 'true';
process.env.CORS_OPTIONS_SUCCESS_STATUS = '204';
process.env.CORS_CREDENTIALS = 'true';
process.env.CORS_ALLOWED_HEADERS = 'Authorization';
process.env.SOCKET_IO_PORT = '8080';
process.env.SOCKET_IO_CLEANUP_EMPTY_CHILD_NAMESPACES = 'true';
process.env.SOCKET_IO_MAX_HTTP_BUFFER_SIZE = '512000';
process.env.SOCKET_IO_PING_INTERVAL = '20000';
process.env.SOCKET_IO_PING_TIMEOUT = '5000';
process.env.SOCKET_IO_ALLOW_EIO3 = 'false';
process.env.SOCKET_IO_TRANSPORTS = 'websocket,polling';
process.env.SOCKET_IO_CORS_ORIGIN = '*';
process.env.SOCKET_IO_CORS_CREDENTIALS = 'true';
process.env.SOCKET_IO_CORS_METHODS = 'GET,POST';
process.env.SOCKET_IO_CONNECT_TIMEOUT = '30000';

import { SocketIOAdapter } from './socket-io.adapter';

describe('SocketIOAdapter', () => {
  it('creates valid socket config from environment variables', () => {
    // todo extend tests
    const config = SocketIOAdapter('TOPIC');
    expect(config.port).toBe(8080);
    expect(config.opts.transports).toEqual(['websocket', 'polling']);
    expect((config.opts.cors as any).origin).toBe('*');
  });
});
