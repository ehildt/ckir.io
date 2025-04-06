import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Queue } from 'bullmq';

import { SocketIOService } from '../socket-io/socket-io.service';
import { BULLMQ_CHAT_JOB, BULLMQ_CHAT_QUEUE, SOCKET_IO_EVENT } from './constants/bullmq.constants';
import { MessageMode } from './constants/message-req.constants';
import { MessageReq } from './dtos/message-req.dto';
import { MessageGatewayService } from './message-gateway.service';

jest.mock('../../socket-io/socket-io.service');
jest.mock('bullmq');

describe('MessageGatewayService', () => {
  let messageGatewayService: MessageGatewayService;
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
        MessageGatewayService,
        {
          provide: SocketIOService,
          useValue: socketIOService,
        },
        {
          provide: `BullQueue_${BULLMQ_CHAT_QUEUE.PERSIST}`,
          useValue: persistQueue,
        },
        {
          provide: `BullQueue_${BULLMQ_CHAT_QUEUE.MESSAGE}`,
          useValue: messageQueue,
        },
        {
          provide: `BullQueue_${BULLMQ_CHAT_QUEUE.VECTORIZE}`,
          useValue: vectorizeQueue,
        },
      ],
    }).compile();

    messageGatewayService = module.get<MessageGatewayService>(MessageGatewayService);
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
      const mockMessage: Partial<MessageReq> = { mode: MessageMode.PERSIST };
      await messageGatewayService.emit(mockMessage as MessageReq);
      expect(persistQueue.add).toHaveBeenCalledWith(BULLMQ_CHAT_JOB.PERSIST, mockMessage);
      expect(vectorizeQueue.add).not.toHaveBeenCalled();
      expect(messageQueue.add).toHaveBeenCalledWith(BULLMQ_CHAT_JOB.MESSAGE, mockMessage);
    });

    it('should add jobs to the message queue even if other queues are skipped', async () => {
      const mockMessage: Partial<MessageReq> = { mode: MessageMode.VECTORIZE };
      await messageGatewayService.emit(mockMessage as MessageReq);
      expect(persistQueue.add).toHaveBeenCalled();
      expect(vectorizeQueue.add).toHaveBeenCalledWith(BULLMQ_CHAT_JOB.VECTORIZE, mockMessage);
      expect(messageQueue.add).toHaveBeenCalledWith(BULLMQ_CHAT_JOB.MESSAGE, mockMessage);
    });

    it('should not add any jobs if no conditions match', async () => {
      const mockMessage: Partial<MessageReq> = {};
      await messageGatewayService.emit(mockMessage as MessageReq);
      expect(persistQueue.add).not.toHaveBeenCalled();
      expect(vectorizeQueue.add).not.toHaveBeenCalled();
      expect(messageQueue.add).toHaveBeenCalledWith(BULLMQ_CHAT_JOB.MESSAGE, mockMessage);
    });
  });
});
