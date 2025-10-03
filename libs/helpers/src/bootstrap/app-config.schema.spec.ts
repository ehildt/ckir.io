import { AppConfigSchema } from './app-config.schema';

describe('AppConfigSchema', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });
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
    expect(
      result.error?.details.some((d) => d.message.includes('printConfig')),
    ).toBe(true);
  });
});
