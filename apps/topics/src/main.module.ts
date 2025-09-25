import { BullMQModule } from '@ckir.io/bullmq';
import { SocketIOModule } from '@ckir.io/socket-io';
import { Logger, Module } from '@nestjs/common';

import { ConfigFactoryModule } from './config-factory/config-factory.module';
import { ConfigFactoryService } from './config-factory/config-factory.service';
import { BULLMQ_QUEUE } from './constants/bullmq.constants';
import { TopicsController } from './controllers/topics.controller';
import { TopicProcessor } from './processors/topic.processor';
import { TopicsService } from './services/topics.service';

@Module({
  imports: [
    ConfigFactoryModule.forRoot({ global: true }),
    BullMQModule.registerAsync({
      global: true,
      inject: [ConfigFactoryService],
      processors: [TopicProcessor],
      queues: [BULLMQ_QUEUE.BROADCAST_TOPIC, BULLMQ_QUEUE.PERSIST_TOPIC, BULLMQ_QUEUE.VECTORIZE_TOPIC],
      usePinoFactory: async ({ pinoConfig }: ConfigFactoryService) => pinoConfig,
      useBullFactory: async ({ bullMQConfig }: ConfigFactoryService) => bullMQConfig,
    }),
    SocketIOModule.registerAsync({
      global: true,
      inject: [ConfigFactoryService],
      useFactory: async ({ socketIOConfig }: ConfigFactoryService) => socketIOConfig,
    }),
  ],
  providers: [Logger, TopicsService],
  controllers: [TopicsController],
})
export class MainModule {}
