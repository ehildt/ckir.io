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
process.env.BULLMQ_USE_TLS = 'false';
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

import { BULLMQ_JOB, BullMQPinoLoggerService } from '@ehildt/ckir-bullmq';
import { SocketIOService } from '@ehildt/ckir-socket-io';
import { Job } from 'bullmq';

import { PostsProcessor } from './posts.socket.io.processor';

describe('PostsProcessor', () => {
  let processor: PostsProcessor;
  let mockSocketIO: jest.Mocked<SocketIOService>;
  let mockLogger: jest.Mocked<BullMQPinoLoggerService>;

  const baseJob = {
    name: BULLMQ_JOB.DISPATCH,
    data: {
      recipientId: 'user123',
      topicId: 'topic456',
      threadId: 'thread789',
    },
  };

  beforeEach(() => {
    mockSocketIO = {
      emit: jest.fn(),
    } as any;

    mockLogger = {
      log: jest.fn(),
      error: jest.fn(),
    } as any;

    processor = new PostsProcessor(mockSocketIO, mockLogger);
  });

  describe('process', () => {
    it('should emit to recipientId if present', async () => {
      const job = baseJob as Job;
      await processor.process(job);
      expect(mockSocketIO.emit).toHaveBeenCalledWith('user123', job.data);
    });

    it('should emit to topicId_threadId if recipientId not present', async () => {
      const job = {
        ...baseJob,
        data: {
          recipientId: undefined,
          topicId: 't123',
          threadId: 'th456',
        },
      } as Job;

      await processor.process(job);
      expect(mockSocketIO.emit).toHaveBeenCalledWith('t123_th456', job.data);
    });

    it('should skip if job name is not POST', async () => {
      const job = {
        ...baseJob,
        name: 'other-job',
      } as Job;

      await processor.process(job);
      expect(mockSocketIO.emit).not.toHaveBeenCalled();
    });
  });

  describe('onCompleted', () => {
    it('should log job completion', async () => {
      const job = baseJob as Job;
      await processor.onCompleted(job);
      expect(mockLogger.log).toHaveBeenCalledWith(job);
    });
  });

  describe('onFailed', () => {
    it('should log job failure', async () => {
      const job = baseJob as Job;
      await processor.onFailed(job);
      expect(mockLogger.error).toHaveBeenCalledWith(job);
    });
  });
});
