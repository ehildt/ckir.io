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

// Socket.IO
process.env.SOCKET_IO_PORT = '4000';
process.env.SOCKET_IO_MAX_HTTP_BUFFER_SIZE = '262144';
process.env.SOCKET_IO_CLEANUP_EMPTY_CHILD_NAMESPACES = 'false';
process.env.SOCKET_IO_TRANSPORTS = 'websocket,polling,webtransport';
process.env.SOCKET_IO_CORS_ORIGIN = '*';
process.env.SOCKET_IO_CORS_CREDENTIALS = 'true';
process.env.SOCKET_IO_CORS_METHODS = 'GET,POST';
process.env.SOCKET_IO_PING_INTERVAL = '25000';
process.env.SOCKET_IO_PING_TIMEOUT = '5000';
process.env.SOCKET_IO_ALLOW_EIO3 = 'false';

// BullMQ Connection Settings
process.env.BULLMQ_HOST = 'keydb';
process.env.BULLMQ_PORT = '6379';
process.env.BULLMQ_USER = 'default';
process.env.BULLMQ_PASS = 'redis';
process.env.BULLMQ_CONNECT_TIMEOUT = '30000';
process.env.BULLMQ_COMMAND_TIMEOUT = '30000';

// TLS Configuration (Optional)
process.env.BULLMQ_TLS = 'false';
process.env.BULLMQ_TLS_REJECT_UNAUTHORIZED = 'true';
process.env.BULLMQ_PASSPHRASE = 'test';
process.env.BULLMQ_TLS_CA = '';
process.env.BULLMQ_TLS_CERT = '';
process.env.BULLMQ_TLS_KEY = '';

// Job Options (Optional)
process.env.BULLMQ_JOB_DELAY = '0';
process.env.BULLMQ_JOB_LIFO = 'false';
process.env.BULLMQ_JOB_PRIORITY = '0';
process.env.BULLMQ_JOB_ATTEMPTS = '15';
process.env.BULLMQ_JOB_STACK_TRACE_LIMIT = '10';
process.env.BULLMQ_REMOVE_ON_COMPLETED_AGE = '604800000';
process.env.BULLMQ_REMOVE_ON_COMPLETED_COUNT = '1000';
process.env.BULLMQ_REMOVE_ON_FAIL_AGE = '604800000';
process.env.BULLMQ_REMOVE_ON_FAIL_COUNT = '1000';
process.env.BULLMQ_LOG_LEVEL = 'info';

// Backoff Strategy (Optional)
process.env.BULLMQ_BACKOFF_TYPE = 'exponential';
process.env.BULLMQ_BACKOFF_DELAY = '5270';

// Jobs & Queues (Optional)
process.env.BULLMQ_JOB_MESSAGE = 'MESSAGE';
process.env.BULLMQ_JOB_PERSIST = 'PERSIST';
process.env.BULLMQ_JOB_VECTORIZE = 'VECTORIZE';
process.env.BULLMQ_QUEUE_PERSIST_MESSAGE = 'PERSIST_MESSAGE';
process.env.BULLMQ_QUEUE_BROADCAST_MESSAGE = 'BROADCAST_MESSAGE';
process.env.BULLMQ_QUEUE_VECTORIZE_MESSAGE = 'VECTORIZE_MESSAGE';
process.env.BULLMQ_QUEUE_PERSIST_TOPIC = 'PERSIST_TOPIC';
process.env.BULLMQ_QUEUE_BROADCAST_TOPIC = 'BROADCAST_TOPIC';
process.env.BULLMQ_QUEUE_VECTORIZE_TOPIC = 'VECTORIZE_TOPIC';
process.env.BULLMQ_QUEUE_PERSIST_THREAD = 'PERSIST_THREAD';
process.env.BULLMQ_QUEUE_BROADCAST_THREAD = 'BROADCAST_THREAD';
process.env.BULLMQ_QUEUE_VECTORIZE_THREAD = 'VECTORIZE_THREAD';

import {
    BULLMQ_JOB,
    BULLMQ_QUEUE,
    BullMQPinoLoggerService,
} from '@ehildt/ckir-bullmq';
import { PostsReq, ProcessingMode } from '@ehildt/ckir-dtos';
import { SOCKET_IO_EVENT, SocketIOService } from '@ehildt/ckir-socket-io';
import { getQueueToken } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Queue } from 'bullmq';

import { PostsService } from './posts.service';

jest.mock('@ehildt/ckir-socket-io');
jest.mock('@ehildt/ckir-dtos');
jest.mock('@ehildt/ckir-bullmq');
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
        {
          provide: BullMQPinoLoggerService,
          useClass: Logger,
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
