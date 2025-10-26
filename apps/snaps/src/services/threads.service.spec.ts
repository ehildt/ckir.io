// Base environment variables
process.env.PORT = '3002';
process.env.ADDRESS = '0.0.0.0';
process.env.NODE_ENV = 'local';
process.env.PRINT_CONFIG = 'true';
process.env.ENABLE_SWAGGER = 'true';
process.env.BODY_LIMIT = '104857600';
process.env.LOG_LEVEL = 'warn';

import { Test, TestingModule } from '@nestjs/testing';

import { ThreadsService } from './threads.service';

import {
  ThreadFilter,
  ThreadsRepository,
} from '@/mongo/repositories/threads.repository';

describe('ThreadsService', () => {
  let service: ThreadsService;

  // Mocking ThreadsRepository
  const mockRepository = {
    findAll: jest.fn(),
    insertIfNotExists: jest.fn(),
    findByHash: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ThreadsService,
        { provide: ThreadsRepository, useValue: mockRepository },
      ],
    }).compile();

    service = module.get<ThreadsService>(ThreadsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call repository.findAll with topicId and filter', async () => {
    const topicId = 'topic123';
    const filter: ThreadFilter = { limit: 1, skip: 0 };
    mockRepository.findAll.mockResolvedValue([{ title: 'thread1' }]);
    const result = await service.threads(topicId, filter);
    expect(mockRepository.findAll).toHaveBeenCalledWith(topicId, filter);
    expect(result).toEqual([{ title: 'thread1' }]);
  });

  it('should call repository.findAll without filter', async () => {
    const topicId = 'topic123';
    mockRepository.findAll.mockResolvedValue([{ title: 'thread2' }]);
    const result = await service.threads(topicId);
    expect(mockRepository.findAll).toHaveBeenCalledWith(topicId, undefined);
    expect(result).toEqual([{ title: 'thread2' }]);
  });

  it('should call repository.insertIfNotExists and return _id as string', async () => {
    const body = { title: 'newThread' };
    mockRepository.insertIfNotExists.mockResolvedValue({
      _id: { toString: () => '456' },
    });
    const result = await service.insertIfNotExists(body);
    expect(mockRepository.insertIfNotExists).toHaveBeenCalledWith(body);
    expect(result).toBe('456');
  });

  it('should return undefined if insertIfNotExists returns null', async () => {
    mockRepository.insertIfNotExists.mockResolvedValue(null);
    const result = await service.insertIfNotExists({ title: 'x' });
    expect(result).toBeUndefined();
  });

  it('should return undefined if insertIfNotExists returns object without _id', async () => {
    mockRepository.insertIfNotExists.mockResolvedValue({});
    const result = await service.insertIfNotExists({ title: 'x' });
    expect(result).toBeUndefined();
  });

  it('should call repository.findByHash and return result', async () => {
    const hash = 'hash123';
    const thread = { title: 'threadHash' };
    mockRepository.findByHash.mockResolvedValue(thread);
    const result = await service.findByHash(hash);
    expect(mockRepository.findByHash).toHaveBeenCalledWith(hash);
    expect(result).toBe(thread);
  });

  it('should handle findByHash returning null', async () => {
    mockRepository.findByHash.mockResolvedValue(null);
    const result = await service.findByHash('hash123');
    expect(result).toBeNull();
  });
});
