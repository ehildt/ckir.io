import { SocketIOAdapter } from './socket-io.adapter';

describe('SocketIOAdapter', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('creates valid socket config from environment variables', () => {
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

    // todo extend tests
    const config = SocketIOAdapter('TOPIC');
    expect(config.port).toBe(8080);
    expect(config.opts.transports).toEqual(['websocket', 'polling']);
    expect((config.opts.cors as any).origin).toBe('*');
  });
});
