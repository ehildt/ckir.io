import { BullModule } from '@nestjs/bullmq';
import { Logger, Module } from '@nestjs/common';

import { ConfigFactoryService } from '@/config-factory/config-factory.service';

import { SocketIOModule } from '../socket-io/socket-io.module';
import { BULLMQ_CHAT_QUEUE } from './constants/bullmq.constants';
import { MessageGatewayController } from './message-gateway.controller';
import { MessageGatewayProcessor } from './message-gateway.processor';
import { MessageGatewayService } from './message-gateway.service';

@Module({
  controllers: [MessageGatewayController],
  providers: [Logger, MessageGatewayService, MessageGatewayProcessor],
  imports: [
    SocketIOModule.register({
      inject: [ConfigFactoryService],
      useFactory: ({ socketIOConfig }: ConfigFactoryService) => socketIOConfig,
    }),
    BullModule.registerQueueAsync(
      {
        name: BULLMQ_CHAT_QUEUE.MESSAGE,
        inject: [ConfigFactoryService],
        useFactory: async ({ bullMQConfig }: ConfigFactoryService) => bullMQConfig,
      },
      {
        name: BULLMQ_CHAT_QUEUE.PERSIST,
        inject: [ConfigFactoryService],
        useFactory: async ({ bullMQConfig }: ConfigFactoryService) => bullMQConfig,
      },
      {
        name: BULLMQ_CHAT_QUEUE.VECTORIZE,
        inject: [ConfigFactoryService],
        useFactory: async ({ bullMQConfig }: ConfigFactoryService) => bullMQConfig,
      },
    ),
  ],
})
export class MessageGatewayModule {}
