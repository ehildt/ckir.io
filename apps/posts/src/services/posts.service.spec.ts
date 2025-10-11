import { BULLMQ_JOB, BULLMQ_QUEUE } from '@ckir.io/bullmq';
import { PostsReq, ProcessingMode } from '@ckir.io/dtos';
import { SOCKET_IO_EVENT, SocketIOService } from '@ckir.io/socket-io';
import { getQueueToken } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Queue } from 'bullmq';

import { PostsService } from './posts.service';

jest.mock('@ckir.io/socket-io');
jest.mock('bullmq');

describe('PostsService', () => {
  let postsService: PostsService;
  let socketIOService: SocketIOService;
  let snapsQueue: Queue;
  let postsQueue: Queue;
  let vectorsQueue: Queue;

  beforeEach(async () => {
    socketIOService = new SocketIOService(null as any, null as any);
    snapsQueue = { add: jest.fn() } as unknown as Queue;
    postsQueue = { add: jest.fn() } as unknown as Queue;
    vectorsQueue = { add: jest.fn() } as unknown as Queue;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Logger,
        PostsService,
        {
          provide: SocketIOService,
          useValue: socketIOService,
        },
        {
          provide: getQueueToken(BULLMQ_QUEUE.PERSIST_POST),
          useValue: snapsQueue,
        },
        {
          provide: getQueueToken(BULLMQ_QUEUE.BROADCAST_POST),
          useValue: postsQueue,
        },
        {
          provide: getQueueToken(BULLMQ_QUEUE.VECTORIZE_POST),
          useValue: vectorsQueue,
        },
      ],
    }).compile();

    postsService = module.get<PostsService>(PostsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('onModuleInit', () => {
    it('should listen to SOCKET_IO_EVENT.POST event and call emit', async () => {
      const mockMessage = {};
      socketIOService.on = jest.fn().mockImplementation((event, callback) => {
        if (event === SOCKET_IO_EVENT.POST) {
          callback({ data: mockMessage });
        }
      });

      const emitSpy = jest.spyOn(postsService, 'emit');
      await postsService.onModuleInit();
      expect(socketIOService.on).toHaveBeenCalledWith(
        SOCKET_IO_EVENT.POST,
        expect.any(Function),
      );
      expect(emitSpy).toHaveBeenCalledWith(mockMessage);
      emitSpy.mockRestore();
    });
  });

  describe('emit', () => {
    it('should add jobs to the correct queues based on posts args', async () => {
      const mockMessage: Partial<PostsReq> = {};
      await postsService.emit(mockMessage as PostsReq, ProcessingMode.PERSIST);
      expect(snapsQueue.add).toHaveBeenCalledWith(
        BULLMQ_JOB.PERSIST,
        mockMessage,
      );
      expect(vectorsQueue.add).not.toHaveBeenCalled();
      expect(postsQueue.add).toHaveBeenCalledWith(
        BULLMQ_JOB.DISPATCH,
        mockMessage,
      );
    });

    it('should add jobs to the posts queue even if other queues are skipped', async () => {
      const mockMessage: Partial<PostsReq> = {};
      await postsService.emit(
        mockMessage as PostsReq,
        ProcessingMode.VECTORIZE,
      );
      expect(snapsQueue.add).not.toHaveBeenCalled();
      expect(vectorsQueue.add).toHaveBeenCalledWith(
        BULLMQ_JOB.VECTORIZE,
        mockMessage,
      );
      expect(postsQueue.add).toHaveBeenCalledWith(
        BULLMQ_JOB.DISPATCH,
        mockMessage,
      );
    });

    it('should not add any jobs if no conditions match', async () => {
      const mockMessage: Partial<PostsReq> = {};
      await postsService.emit(mockMessage as PostsReq);
      expect(snapsQueue.add).not.toHaveBeenCalled();
      expect(vectorsQueue.add).not.toHaveBeenCalled();
      expect(postsQueue.add).toHaveBeenCalledWith(
        BULLMQ_JOB.DISPATCH,
        mockMessage,
      );
    });
  });
});
