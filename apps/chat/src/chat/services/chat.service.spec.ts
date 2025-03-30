import { Logger } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { ChatMessageReq } from '@/chat/dtos/chat-message.dto.req';
import { ConfigFactoryService } from '@/config-factory/config-factory.service';

import { SocketIOService } from '../../socket-io/socket-io.service';
import { ChatService } from './chat.service';

describe('ChatService', () => {
  let chatService: ChatService;
  let mockSocketIO: jest.Mocked<SocketIOService>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        Logger,
        ChatService,
        {
          provide: ConfigFactoryService,
          useValue: { app: { brcsChannel: 'some_channel' } },
        },
        {
          provide: SocketIOService,
          useValue: {
            emit: jest.fn(),
          },
        },
      ],
    }).compile();

    chatService = moduleRef.get(ChatService);
    mockSocketIO = moduleRef.get(SocketIOService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('chats', () => {
    it('should distribute messages to realms using enabled messaging options', async () => {
      const req: ChatMessageReq = {
        topic: { id: '2', name: 'how to stop simping' },
        message: 'start by going to gym frequently',
        publisherId: 'user_cuid',
      };
      await chatService.emit(req);
      expect(mockSocketIO.emit).toHaveBeenCalledTimes(1);
    });
  });
});
