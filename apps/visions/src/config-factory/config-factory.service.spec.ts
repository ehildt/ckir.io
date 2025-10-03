import { Test, TestingModule } from '@nestjs/testing';

import { ConfigFactoryService } from './config-factory.service';

describe('ConfigFactoryService', () => {
  let service: ConfigFactoryService;

  beforeAll(() => {
    process.env.PORT = '3001';
    process.env.ADDRESS = '0.0.0.0';
    process.env.NODE_ENV = 'local';
    process.env.PRINT_CONFIG = 'true';
    process.env.ENABLE_SWAGGER = 'true';
    process.env.BODY_LIMIT = '104857600';
    process.env.CORS_ORIGIN = '*';
    process.env.CORS_METHODS = 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE';
    process.env.CORS_PREFLIGHT_CONTINUE = 'false';
    process.env.CORS_OPTIONS_SUCCESS_STATUS = '204';
    process.env.CORS_CREDENTIALS = 'true';
    process.env.CORS_ALLOWED_HEADERS =
      'Content-Type,Authorization,Accept,X-Requested-With';
    process.env.BULLMQ_HOST = 'keydb';
    process.env.BULLMQ_PORT = '6379';
    process.env.BULLMQ_USER = 'default';
    process.env.BULLMQ_PASS = 'redis';
    process.env.BULLMQ_JOB_DELAY = '0';
    process.env.BULLMQ_JOB_LIFO = 'false';
    process.env.BULLMQ_JOB_PRIORITY = '0';
    process.env.BULLMQ_JOB_ATTEMPTS = '15';
    process.env.BULLMQ_JOB_STACK_TRACE_LIMIT = '10';
    process.env.BULLMQ_REMOVE_ON_COMPLETE = 'true';
    process.env.BULLMQ_REMOVE_ON_FAIL_AGE = '604800000';
    process.env.BULLMQ_REMOVE_ON_FAIL_COUNT = '1000';
    process.env.BULLMQ_BACKOFF_TYPE = 'exponential';
    process.env.BULLMQ_BACKOFF_DELAY = '5270';
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConfigFactoryService],
    }).compile();

    service = module.get<ConfigFactoryService>(ConfigFactoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return valid appConfig', () => {
    const appConfig = service.appConfig;
    expect(appConfig).toBeDefined();
    expect(appConfig.port).toBe(3001);
    expect(appConfig.nodeEnv).toBe('local');
    expect(appConfig.printConfig).toBe(true);
    expect(appConfig.cors).toBeDefined();
    expect(appConfig.cors.origin).toBe('*');
    expect(appConfig.cors.methods).toBe(
      'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
    );
  });

  it('should return valid bullMQConfig', () => {
    const bullMQConfig = service.bullMQConfig;
    expect(bullMQConfig).toBeDefined();
    expect(bullMQConfig.connection).toBeDefined();
    expect(bullMQConfig.connection.host).toBe('keydb');
    expect(bullMQConfig.connection.port).toBe(6379);
    expect(bullMQConfig.connection.username).toBe('default');
    expect(bullMQConfig.connection.password).toBe('redis');
  });
});
