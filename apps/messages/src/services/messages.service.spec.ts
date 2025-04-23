import { SocketIOService } from '@ckir.io/socket-io';
import { getQueueToken } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Queue } from 'bullmq';

import { GatewayMode } from '../constants/gateway-mode.constants';
import { MessagesService } from '../services/messages.service';

import { BULLMQ_JOB, BULLMQ_QUEUE } from '@/constants/bullmq.constants';
import { SOCKET_IO_EVENT } from '@/constants/socket-io.constants';
import { MessageReq } from '@/dtos/message-req.dto';

jest.mock('../socket-io/socket-io.service');
jest.mock('bullmq');

describe('MessageGatewayService', () => {
  let messageGatewayService: MessagesService;
  let socketIOService: SocketIOService;
  let persistQueue: Queue;
  let messageQueue: Queue;
  let vectorizeQueue: Queue;

  beforeEach(async () => {
    socketIOService = new SocketIOService(null as any, null as any);
    persistQueue = { add: jest.fn() } as unknown as Queue;
    messageQueue = { add: jest.fn() } as unknown as Queue;
    vectorizeQueue = { add: jest.fn() } as unknown as Queue;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Logger,
        MessagesService,
        {
          provide: SocketIOService,
          useValue: socketIOService,
        },
        {
          provide: getQueueToken(BULLMQ_QUEUE.PERSIST_MESSAGE),
          useValue: persistQueue,
        },
        {
          provide: getQueueToken(BULLMQ_QUEUE.BROADCAST_MESSAGE),
          useValue: messageQueue,
        },
        {
          provide: getQueueToken(BULLMQ_QUEUE.VECTORIZE_MESSAGE),
          useValue: vectorizeQueue,
        },
      ],
    }).compile();

    messageGatewayService = module.get<MessagesService>(MessagesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('onModuleInit', () => {
    it('should listen to SOCKET_IO_EVENT.MESSAGE event and call emit', async () => {
      const mockMessage = {};
      socketIOService.on = jest.fn().mockImplementation((event, callback) => {
        if (event === SOCKET_IO_EVENT.MESSAGE) {
          callback({ data: mockMessage });
        }
      });

      const emitSpy = jest.spyOn(messageGatewayService, 'emit');
      await messageGatewayService.onModuleInit();
      expect(socketIOService.on).toHaveBeenCalledWith(SOCKET_IO_EVENT.MESSAGE, expect.any(Function));
      expect(emitSpy).toHaveBeenCalledWith(mockMessage);
      emitSpy.mockRestore();
    });
  });

  describe('emit', () => {
    it('should add jobs to the correct queues based on message args', async () => {
      const mockMessage: Partial<MessageReq> = {};
      await messageGatewayService.emit(mockMessage as MessageReq, GatewayMode.PERSIST);
      expect(persistQueue.add).toHaveBeenCalledWith(BULLMQ_JOB.PERSIST, mockMessage);
      expect(vectorizeQueue.add).not.toHaveBeenCalled();
      expect(messageQueue.add).toHaveBeenCalledWith(BULLMQ_JOB.DISPATCH, mockMessage);
    });

    it('should add jobs to the message queue even if other queues are skipped', async () => {
      const mockMessage: Partial<MessageReq> = {};
      await messageGatewayService.emit(mockMessage as MessageReq, GatewayMode.VECTORIZE);
      expect(persistQueue.add).not.toHaveBeenCalled();
      expect(vectorizeQueue.add).toHaveBeenCalledWith(BULLMQ_JOB.VECTORIZE, mockMessage);
      expect(messageQueue.add).toHaveBeenCalledWith(BULLMQ_JOB.DISPATCH, mockMessage);
    });

    it('should not add any jobs if no conditions match', async () => {
      const mockMessage: Partial<MessageReq> = {};
      await messageGatewayService.emit(mockMessage as MessageReq);
      expect(persistQueue.add).not.toHaveBeenCalled();
      expect(vectorizeQueue.add).not.toHaveBeenCalled();
      expect(messageQueue.add).toHaveBeenCalledWith(BULLMQ_JOB.DISPATCH, mockMessage);
    });
  });
});
