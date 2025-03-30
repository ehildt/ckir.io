import { BullModule } from '@nestjs/bullmq';
import { Logger, Module } from '@nestjs/common';

import { ChatController } from '@/chat/controllers/chat.controller';
import { ConfigFactoryService } from '@/config-factory/config-factory.service';

import { SocketIOModule } from '../socket-io/socket-io.module';
import { BULLMQ_CHAT_QUEUE } from './constants/bullmq.constants';
import { MessageProcessor } from './processors/message.processor';
import { ChatService } from './services/chat.service';

@Module({
  controllers: [ChatController],
  providers: [Logger, ChatService, MessageProcessor],
  imports: [
    SocketIOModule.register({
      inject: [ConfigFactoryService],
      useFactory: ({ socketIOConfig }: ConfigFactoryService) => socketIOConfig,
    }),
    BullModule.registerQueueAsync(
      {
        name: BULLMQ_CHAT_QUEUE.MESSAGE,
        inject: [ConfigFactoryService],
        useFactory: ({ bullMQConfig }: ConfigFactoryService) => bullMQConfig,
      },
      {
        name: BULLMQ_CHAT_QUEUE.PERSIST,
        inject: [ConfigFactoryService],
        useFactory: ({ bullMQConfig }: ConfigFactoryService) => bullMQConfig,
      },
      {
        name: BULLMQ_CHAT_QUEUE.VECTORIZE,
        inject: [ConfigFactoryService],
        useFactory: ({ bullMQConfig }: ConfigFactoryService) => bullMQConfig,
      },
    ),
  ],
})
export class ChatModule {}
