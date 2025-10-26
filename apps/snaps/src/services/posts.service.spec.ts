// Base environment variables
process.env.PORT = '3002';
process.env.ADDRESS = '0.0.0.0';
process.env.NODE_ENV = 'local';
process.env.PRINT_CONFIG = 'true';
process.env.ENABLE_SWAGGER = 'true';
process.env.BODY_LIMIT = '104857600';
process.env.LOG_LEVEL = 'warn';

import { Test, TestingModule } from '@nestjs/testing';

import { PostsService } from './posts.service';

import {
  PostsFilter,
  PostsRepository,
} from '@/mongo/repositories/posts.repository';

describe('PostsService', () => {
  let service: PostsService;

  // Mocking PostsRepository with valid _id and attachments
  const mockRepository = {
    findAll: jest.fn(),
    findAllAttachments: jest.fn().mockResolvedValue({
      attachments: [{ name: 'file1' }], // always provide attachments
    }),
    insertIfNotExists: jest.fn().mockResolvedValue({
      _id: { toString: () => 'mocked-id' }, // always provide _id
    }),
    findByHash: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        { provide: PostsRepository, useValue: mockRepository },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call repository.findAll with threadId and filter', async () => {
    const threadId = 'thread123';
    const filter: PostsFilter = { limit: 1, skip: 0 };
    mockRepository.findAll.mockResolvedValue([{ title: 'post1' }]);
    const result = await service.posts(threadId, filter);
    expect(mockRepository.findAll).toHaveBeenCalledWith(threadId, filter);
    expect(result).toEqual([{ title: 'post1' }]);
  });

  it('should call repository.findAll without filter', async () => {
    const threadId = 'thread123';
    mockRepository.findAll.mockResolvedValue([{ title: 'post2' }]);
    const result = await service.posts(threadId);
    expect(mockRepository.findAll).toHaveBeenCalledWith(threadId, undefined);
    expect(result).toEqual([{ title: 'post2' }]);
  });

  it('should call repository.findAllAttachments and return attachments', async () => {
    const postId = 'post123';
    const threadId = 'thread123';
    const filter: PostsFilter = { limit: 5, skip: 0 };
    const result = await service.attachments(postId, threadId, filter);
    expect(mockRepository.findAllAttachments).toHaveBeenCalledWith(
      postId,
      threadId,
      filter,
    );
    expect(result).toEqual([{ name: 'file1' }]);
  });

  it('should call repository.insertIfNotExists and return _id as string', async () => {
    const body = { title: 'newPost' };
    const result = await service.insertIfNotExists(body);
    expect(mockRepository.insertIfNotExists).toHaveBeenCalledWith(body);
    expect(result).toBe('mocked-id');
  });

  it('should call repository.findByHash and return result', async () => {
    const hash = 'hash789';
    const post = { title: 'postHash' };
    mockRepository.findByHash.mockResolvedValue(post);
    const result = await service.findByHash(hash);
    expect(mockRepository.findByHash).toHaveBeenCalledWith(hash);
    expect(result).toBe(post);
  });
});
