import { SocketIOConfigSchema } from './socket-io.schema';

describe('SocketIOAdapter', () => {
  const originalEnv = process.env;
  const validConfig = {
    event: 'message',
    port: 3000,
    opts: {
      cleanupEmptyChildNamespaces: true,
      maxHttpBufferSize: 256000,
      pingInterval: 25000,
      pingTimeout: 5000,
      allowEIO3: false,
      connectTimeout: 30_000,
      transports: ['websocket', 'polling'],
      cors: {
        origin: '*',
        credentials: true,
        methods: ['GET', 'POST'],
      },
    },
  };

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });
  it('accepts valid config', () => {
    const result = SocketIOConfigSchema.validate(validConfig);
    expect(result.error).toBeUndefined();
  });

  it('rejects invalid transport', () => {
    const invalid = {
      ...validConfig,
      opts: { ...validConfig.opts, transports: ['invalid'] },
    };
    const result = SocketIOConfigSchema.validate(invalid);
    expect(result.error).toBeDefined();
    expect(result.error?.details[0].message).toMatch(/transports/);
  });
});
