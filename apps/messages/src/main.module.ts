import { BullMQModule } from '@ckir.io/bullmq';
import { SocketIOModule } from '@ckir.io/socket-io';
import { Logger, Module } from '@nestjs/common';

import { ConfigFactoryModule } from './config-factory/config-factory.module';
import { ConfigFactoryService } from './config-factory/config-factory.service';
import { BULLMQ_QUEUE } from './constants/bullmq.constants';
import { MessagesController } from './controllers/messages.controller';
import { MessageProcessor } from './processors/message.processor';
import { MessagesService } from './services/messages.service';

@Module({
  imports: [
    ConfigFactoryModule.forRoot({ global: true }),
    BullMQModule.registerAsync({
      global: true,
      inject: [ConfigFactoryService],
      processors: [MessageProcessor],
      queues: [BULLMQ_QUEUE.BROADCAST_MESSAGE, BULLMQ_QUEUE.PERSIST_MESSAGE, BULLMQ_QUEUE.VECTORIZE_MESSAGE],
      usePinoFactory: async ({ pinoConfig }: ConfigFactoryService) => pinoConfig,
      useBullFactory: async ({ bullMQConfig }: ConfigFactoryService) => bullMQConfig,
    }),
    SocketIOModule.registerAsync({
      global: true,
      inject: [ConfigFactoryService],
      useFactory: async ({ socketIOConfig }: ConfigFactoryService) => socketIOConfig,
    }),
  ],
  providers: [Logger, MessagesService],
  controllers: [MessagesController],
})
export class MainModule {}
