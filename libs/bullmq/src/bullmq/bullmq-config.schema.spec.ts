import { BullMQPinoLoggerSchema } from '../logger/bullmq-pino-logger.schema';

describe('BullMQPinoLoggerSchema', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('accepts valid config', () => {
    const result = BullMQPinoLoggerSchema.validate({
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
    const result = BullMQPinoLoggerSchema.validate({
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
