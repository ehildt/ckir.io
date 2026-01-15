import { Test, TestingModule } from '@nestjs/testing';
import { Job } from 'bullmq';
import { Logger } from 'pino';

import { BULLMQ_PINO_LOGGER } from './bullmq-pino-logger.constants';
import { BullMQPinoLoggerService } from './bullmq-pino-logger.service';

describe('BullMQPinoLoggerService', () => {
  let service: BullMQPinoLoggerService;
  let mockLogger: jest.Mocked<Logger>;

  const createMockJob = (state: string): Partial<Job> => ({
    name: 'test-job',
    id: '1234',
    attemptsMade: 1,
    queueName: 'test-queue',
    timestamp: 123456789,
    processedOn: 123456790,
    finishedOn: 123456791,
    opts: { attempts: 3, delay: 500 },
    data: { foo: 'bar' },
    failedReason: 'Something went wrong',
    stacktrace: ['stack line 1', 'stack line 2'],
    getState: jest.fn().mockResolvedValue(state),
  });

  beforeEach(async () => {
    mockLogger = {
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
      trace: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BullMQPinoLoggerService,
        {
          provide: BULLMQ_PINO_LOGGER,
          useValue: mockLogger,
        },
      ],
    }).compile();

    service = module.get<BullMQPinoLoggerService>(BullMQPinoLoggerService);
  });

  it('should log info in log()', async () => {
    const job = createMockJob('completed') as Job;
    await service.log(job);
    expect(mockLogger.info).toHaveBeenCalledWith(
      expect.stringContaining(
        '📦 test-queue(test-job) 🆔 ID-1234 🔄 Attempts-1 🟢 completed',
      ),
    );
  });

  it('should log error in error()', async () => {
    const job = createMockJob('failed') as Job;
    await service.error(job);
    expect(mockLogger.error).toHaveBeenCalledWith(
      expect.objectContaining({
        msg: expect.stringContaining('⚫ failed'),
        failedReason: 'Something went wrong',
        stacktrace: ['stack line 1', 'stack line 2'],
      }),
    );
  });

  it('should log warn in warn()', async () => {
    const job = createMockJob('delayed') as Job;
    await service.warn(job);
    expect(mockLogger.warn).toHaveBeenCalledWith(
      expect.objectContaining({
        msg: expect.stringContaining('🟠 delayed'),
        queue: 'test-queue',
        maxAttempts: 3,
        delay: 500,
        timestamp: 123456789,
        processedOn: 123456790,
        finishedOn: 123456791,
      }),
    );
  });

  it('should log debug in debug()', async () => {
    const job = createMockJob('active') as Job;
    await service.debug(job);
    expect(mockLogger.debug).toHaveBeenCalledWith(
      expect.objectContaining({
        msg: expect.stringContaining('🟣 active'),
        queue: 'test-queue',
        timestamp: 123456789,
        opts: expect.any(Object),
        data: expect.any(Object),
      }),
    );
  });

  it('should log trace in verbose()', async () => {
    const job = createMockJob('waiting') as Job;
    await service.verbose(job);
    expect(mockLogger.trace).toHaveBeenCalledWith(
      job,
      expect.stringContaining('🟡 waiting'),
    );
  });
});
