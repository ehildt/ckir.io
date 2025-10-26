// Base
process.env.PORT = '3002';
process.env.ADDRESS = '0.0.0.0';
process.env.NODE_ENV = 'local';
process.env.PRINT_CONFIG = 'true';
process.env.ENABLE_SWAGGER = 'true';
process.env.BODY_LIMIT = '104857600';
process.env.LOG_LEVEL = 'warn';

// CORS
process.env.CORS_ORIGIN = '*';
process.env.CORS_METHODS = 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE';
process.env.CORS_PREFLIGHT_CONTINUE = 'false';
process.env.CORS_OPTIONS_SUCCESS_STATUS = '204';
process.env.CORS_CREDENTIALS = 'true';
process.env.CORS_ALLOWED_HEADERS =
  'Content-Type,Authorization,Accept,X-Requested-With';

import { Test, TestingModule } from '@nestjs/testing';

import {
  TopicsFilter,
  TopicsRepository,
} from '../mongo/repositories/topic.repository';

import { TopicsService } from './topics.service';

describe('TopicsService', () => {
  let service: TopicsService;

  // Mocking TopicsRepository
  const mockRepository = {
    findAll: jest.fn(),
    insertIfNotExists: jest.fn(),
    findByHash: jest.fn(),
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TopicsService,
        { provide: TopicsRepository, useValue: mockRepository }, // injecting mock
      ],
    }).compile();

    service = module.get<TopicsService>(TopicsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call repository.findAll with filter', async () => {
    const filter: TopicsFilter = { limit: 1, skip: 0 };
    mockRepository.findAll.mockResolvedValue([{ name: 'topic1' }]);
    const result = await service.topics(filter);
    expect(mockRepository.findAll).toHaveBeenCalledWith(filter);
    expect(result).toEqual([{ name: 'topic1' }]);
  });

  it('should call repository.findAll without filter', async () => {
    mockRepository.findAll.mockResolvedValue([{ name: 'topic2' }]);
    const result = await service.topics();
    expect(mockRepository.findAll).toHaveBeenCalledWith(undefined);
    expect(result).toEqual([{ name: 'topic2' }]);
  });

  it('should call repository.insertIfNotExists and return _id as string', async () => {
    const body = { name: 'newTopic' };
    mockRepository.insertIfNotExists.mockResolvedValue({
      _id: { toString: () => '123' },
    });
    const result = await service.insertIfNotExists(body);
    expect(mockRepository.insertIfNotExists).toHaveBeenCalledWith(body);
    expect(result).toBe('123');
  });

  it('should return undefined if insertIfNotExists returns null', async () => {
    mockRepository.insertIfNotExists.mockResolvedValue(null);
    const result = await service.insertIfNotExists({ name: 'x' });
    expect(result).toBeUndefined();
  });

  it('should return undefined if insertIfNotExists returns object without _id', async () => {
    mockRepository.insertIfNotExists.mockResolvedValue({});
    const result = await service.insertIfNotExists({ name: 'x' });
    expect(result).toBeUndefined();
  });

  it('should call repository.findByHash and return result', async () => {
    const hash = 'abc123';
    const topic = { name: 'topicHash' };
    mockRepository.findByHash.mockResolvedValue(topic);
    const result = await service.findByHash(hash);
    expect(mockRepository.findByHash).toHaveBeenCalledWith(hash);
    expect(result).toBe(topic);
  });

  it('should handle findByHash returning null', async () => {
    mockRepository.findByHash.mockResolvedValue(null);
    const result = await service.findByHash('abc123');
    expect(result).toBeNull();
  });

  it('should call repository.findById and return result', async () => {
    const id = 'id123';
    const topic = { name: 'topicById' };
    mockRepository.findById.mockResolvedValue(topic);
    const result = await service.findById(id);
    expect(mockRepository.findById).toHaveBeenCalledWith(id);
    expect(result).toBe(topic);
  });

  it('should handle findById returning null', async () => {
    mockRepository.findById.mockResolvedValue(null);
    const result = await service.findById('id123');
    expect(result).toBeNull();
  });
});
