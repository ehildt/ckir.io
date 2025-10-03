import { BullMQPinoAdapter } from '../logger/bullmq-pino-logger.adapter';

describe('BullMQPinoAdapter', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('returns default pino logger config', () => {
    const config = BullMQPinoAdapter();
    expect(config.level).toBe('info');
    expect((config.transport as any)?.target).toBe('pino-pretty');
    expect(typeof config.timestamp).toBe('function');
  });
});
