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

import { ValidateReturnValueError } from '@ehildt/ckir-config-factory';
import { AppConfigSchema } from '@ehildt/ckir-helpers';

import { AppConfigAdapter } from './app-config.adapter';
import { AppConfigService } from './app-config.service';

jest.mock('./app-config.adapter');

describe('AppConfigService', () => {
  let service: AppConfigService;

  beforeEach(() => {
    service = new AppConfigService();
    jest.clearAllMocks();
  });

  it('should return the config from AppConfigAdapter', () => {
    const mockConfig = {
      printConfig: true,
      enableSwagger: false,
      bodyLimit: 1024,
      address: '127.0.0.1',
      port: 3000,
      nodeEnv: 'development',
      logLevel: ['warn'],
    };
    (AppConfigAdapter as jest.Mock).mockReturnValue(mockConfig);

    const result = service.appConfig;

    expect(result).toEqual(mockConfig);
    expect(AppConfigAdapter).toHaveBeenCalledTimes(1);
  });

  it('should cache the result on subsequent calls', () => {
    const mockConfig = {
      printConfig: true,
      enableSwagger: false,
      bodyLimit: 1024,
      address: '127.0.0.1',
      port: 3000,
      nodeEnv: 'development',
      logLevel: ['warn'],
    };
    (AppConfigAdapter as jest.Mock).mockReturnValue(mockConfig);

    const firstCall = service.appConfig;
    const secondCall = service.appConfig;

    expect(firstCall).toBe(secondCall); // same reference
    expect(AppConfigAdapter).toHaveBeenCalledTimes(1);
  });

  it('should throw ValidateReturnValueError for invalid config', () => {
    const invalidConfig = {
      printConfig: 'yes', // invalid type
      enableSwagger: false,
      bodyLimit: 1024,
      address: '127.0.0.1',
      port: 3000,
      nodeEnv: 'development',
      logLevel: ['warn'],
    };
    (AppConfigAdapter as jest.Mock).mockReturnValue(invalidConfig);

    expect(() => service.appConfig).toThrow(ValidateReturnValueError);
  });

  it('should validate successfully with Joi', () => {
    const validConfig = {
      printConfig: true,
      enableSwagger: false,
      bodyLimit: 1024,
      address: '192.168.0.1',
      port: 8080,
      nodeEnv: 'production',
      logLevel: ['error', 'warn'],
    };
    (AppConfigAdapter as jest.Mock).mockReturnValue(validConfig);

    const result = service.appConfig;
    const { error } = AppConfigSchema.validate(result);
    expect(error).toBeUndefined();
  });
});
