import {
  AppConfigAdapter,
  AppConfigSchema,
  BullMQConfigAdapter,
  BullMQConfigArgsAdapter,
  BullMQConfigArgsSchema,
  BullMQConfigSchema,
  PinoAdapter,
  PinoLoggerConfigSchema,
  SocketIOAdapter,
  SocketIOConfigSchema,
} from './config-factory.adapters';

describe('Config Adapter Functions', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('AppConfigAdapter', () => {
    it('returns expected config from environment variables', () => {
      process.env.ADDRESS = '127.0.0.1';
      process.env.NODE_ENV = 'development';
      process.env.PORT = '3000';
      process.env.BODY_LIMIT = '1024';
      process.env.PRINT_CONFIG = 'true';
      process.env.ENABLE_SWAGGER = 'false';
      process.env.CORS_ORIGIN = 'https://example.com';
      process.env.CORS_METHODS = 'GET,POST';
      process.env.CORS_PREFLIGHT_CONTINUE = 'true';
      process.env.CORS_OPTIONS_SUCCESS_STATUS = '204';
      process.env.CORS_CREDENTIALS = 'true';
      process.env.CORS_ALLOWED_HEADERS = 'Authorization';

      const config = AppConfigAdapter();
      expect(config).toEqual({
        address: '127.0.0.1',
        nodeEnv: 'development',
        port: 3000,
        bodyLimit: 1024,
        printConfig: true,
        enableSwagger: false,
        cors: {
          origin: 'https://example.com',
          methods: 'GET,POST',
          preflightContinue: true,
          optionsSuccessStatus: 204,
          credentials: true,
          allowedHeaders: 'Authorization',
        },
      });
    });
  });

  describe('BullMQConfigArgsAdapter', () => {
    it('falls back to defaults when env vars are not set', () => {
      const config = BullMQConfigArgsAdapter();
      expect(config.jobPersist).toBeDefined();
      expect(config.queueBroadcastMessage).toBeDefined();
    });

    it('uses environment variables if provided', () => {
      process.env.BULLMQ_JOB_PERSIST = 'customPersist';
      process.env.BULLMQ_QUEUE_BROADCAST_MESSAGE = 'customBroadcast';

      const config = BullMQConfigArgsAdapter();
      expect(config.jobPersist).toBe('customPersist');
      expect(config.queueBroadcastMessage).toBe('customBroadcast');
    });
  });

  describe('BullMQConfigAdapter', () => {
    it('returns job options and connection config', () => {
      process.env.BULLMQ_JOB_ATTEMPTS = '3';
      process.env.BULLMQ_PORT = '6380';
      process.env.BULLMQ_USE_TLS = 'false';

      const config = BullMQConfigAdapter();
      expect(config.defaultJobOptions.attempts).toBe(3);
      expect(config.connection.port).toBe(6380);
      expect(config.connection.tls).toBe(null);
    });

    it('parses TLS settings when BULLMQ_USE_TLS is true', () => {
      process.env.BULLMQ_USE_TLS = 'true';
      process.env.BULLMQ_TLS_REJECT_UNAUTHORIZED = 'true';
      process.env.BULLMQ_TLS_CA = Buffer.from('ca').toString('base64');
      process.env.BULLMQ_TLS_CERT = Buffer.from('cert').toString('base64');
      process.env.BULLMQ_TLS_KEY = Buffer.from('key').toString('base64');

      const config = BullMQConfigAdapter();
      expect(config.connection.tls).toBeDefined();
      expect(config.connection.tls?.rejectUnauthorized).toBe(true);
      expect(config.connection.tls?.cert).toBeInstanceOf(Buffer);
    });
  });

  describe('SocketIOAdapter', () => {
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

      const config = SocketIOAdapter();
      expect(config.port).toBe(8080);
      expect(config.opts.transports).toEqual(['websocket', 'polling']);
      expect((config.opts.cors as any).origin).toBe('*');
    });
  });

  describe('PinoAdapter', () => {
    it('returns default pino logger config', () => {
      const config = PinoAdapter();
      expect(config.level).toBe('info');
      expect((config.transport as any)?.target).toBe('pino-pretty');
      expect(typeof config.timestamp).toBe('function');
    });
  });
});

describe('Joi Schema Validations', () => {
  describe('AppConfigSchema', () => {
    it('validates correct config', () => {
      const result = AppConfigSchema.validate({
        printConfig: true,
        enableSwagger: false,
        bodyLimit: 1024,
        address: '127.0.0.1',
        port: 3000,
        nodeEnv: 'development',
        cors: {
          origin: 'https://example.com',
          methods: 'GET,POST',
          preflightContinue: false,
          optionsSuccessStatus: 204,
          credentials: true,
          allowedHeaders: 'Authorization',
        },
      });

      expect(result.error).toBeUndefined();
    });

    it('fails if required fields are missing', () => {
      const result = AppConfigSchema.validate({});
      expect(result.error).toBeDefined();
      expect(result.error?.details.some((d) => d.message.includes('printConfig'))).toBe(true);
    });
  });

  describe('BullMQConfigArgsSchema', () => {
    it('validates required string values', () => {
      const result = BullMQConfigArgsSchema.validate({
        jobPersist: 'persist',
        jobDispatch: 'msg',
        jobVectorize: 'vec',
        queuePersist: 'qPersist',
        queueMessage: 'qMsg',
        queueVectorize: 'qVec',
      });

      expect(result.error).toBeUndefined();
    });

    it('fails if one field is empty', () => {
      const result = BullMQConfigArgsSchema.validate({
        jobPersist: 'persist',
        jobDispatch: '',
        jobVectorize: 'vec',
        queuePersist: 'qPersist',
        queueMessage: 'qMsg',
        queueVectorize: 'qVec',
      });

      expect(result.error).toBeDefined();
      expect(result.error?.details.some((d) => d.path.includes('jobDispatch'))).toBe(true);
    });
  });

  describe('BullMQConfigSchema', () => {
    const validConfig = {
      defaultJobOptions: {
        delay: 0,
        lifo: false,
        priority: 1,
        attempts: 5,
        stackTraceLimit: 10,
        removeOnComplete: { age: 604800, count: 1000 },
        removeOnFail: { age: 604800, count: 1000 },
        backoff: { type: 'exponential', delay: 500 },
      },
      connection: {
        host: 'localhost',
        port: 6379,
        username: '',
        password: '',
      },
    };

    it('validates complete config without TLS', () => {
      const result = BullMQConfigSchema.validate(validConfig);
      expect(result.error).toBeUndefined();
    });

    it('fails if required nested fields are missing', () => {
      const invalidConfig = { ...validConfig };
      delete invalidConfig.defaultJobOptions.backoff;

      const result = BullMQConfigSchema.validate(invalidConfig);
      expect(result.error).toBeDefined();
      expect(result.error?.details.some((d) => d.path.join('.').includes('backoff'))).toBe(true);
    });
  });

  describe('SocketIOConfigSchema', () => {
    const validConfig = {
      event: 'message',
      port: 3000,
      opts: {
        cleanupEmptyChildNamespaces: true,
        maxHttpBufferSize: 256000,
        pingInterval: 25000,
        pingTimeout: 5000,
        allowEIO3: false,
        transports: ['websocket', 'polling'],
        cors: {
          origin: '*',
          credentials: true,
          methods: ['GET', 'POST'],
        },
      },
    };

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

  describe('PinoLoggerConfigSchema', () => {
    it('accepts valid config', () => {
      const result = PinoLoggerConfigSchema.validate({
        level: 'debug',
        base: null,
        timestamp: () => new Date().toISOString(),
        transport: {
          target: 'pino-pretty',
          options: {
            translateTime: 'yyyy-mm-dd HH:MM:ss.l',
            colorize: true,
            ignore: 'pid,hostname',
          },
        },
      });

      expect(result.error).toBeUndefined();
    });

    it('fails with invalid level', () => {
      const result = PinoLoggerConfigSchema.validate({
        level: 'invalid',
        base: null,
        timestamp: () => new Date().toISOString(),
        transport: {
          target: 'pino-pretty',
          options: {
            translateTime: 'yyyy-mm-dd HH:MM:ss.l',
            colorize: true,
            ignore: 'pid,hostname',
          },
        },
      });

      expect(result.error).toBeDefined();
      expect(result.error?.details[0].message).toMatch(/level/);
    });
  });
});
