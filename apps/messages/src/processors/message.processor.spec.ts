import { BullMQLoggerService } from '@ckir.io/bullmq';
import { SocketIOService } from '@ckir.io/socket-io';
import { Job } from 'bullmq';

import { MessageProcessor } from './message.processor';

import { BULLMQ_JOB } from '@/constants/bullmq.constants';

describe('MessageProcessor', () => {
  let processor: MessageProcessor;
  let mockSocketIO: jest.Mocked<SocketIOService>;
  let mockLogger: jest.Mocked<BullMQLoggerService>;

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

    processor = new MessageProcessor(mockSocketIO, mockLogger);
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

    it('should skip if job name is not MESSAGE', async () => {
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
