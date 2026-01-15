import { BULLMQ_QUEUE, BullMQModule } from '@ehildt/ckir-bullmq';
import { BullMQPinoLoggerModule } from '@ehildt/ckir-bullmq-logger';
import { ConfigFactoryModule } from '@ehildt/ckir-config-factory';
import { SocketIOModule } from '@ehildt/ckir-socket-io';
import { Logger, Module } from '@nestjs/common';

import { AppConfigService } from './configs/app-config.service';
import { BullMQConfigService } from './configs/bullmq-config.service';
import { SocketIOConfigService } from './configs/socket-io-config.service';
import { TopicsController } from './controllers/topics.controller';
import { TopicProcessor } from './processors/topic.processor';
import { TopicsVectorizeProcessor } from './processors/topics.vectorize.processor';
import { TopicsService } from './services/topics.service';

@Module({
  providers: [TopicsService, Logger],
  controllers: [TopicsController],
  imports: [
    ConfigFactoryModule.forRoot({
      global: true,
      providers: [AppConfigService, BullMQConfigService, SocketIOConfigService],
    }),
    BullMQPinoLoggerModule.registerAsync({
      global: true,
      inject: [BullMQConfigService],
      useFactory: async ({ pinoConfig }: BullMQConfigService) => pinoConfig,
    }),
    BullMQModule.registerAsync({
      global: true,
      inject: [BullMQConfigService],
      processors: [TopicProcessor, TopicsVectorizeProcessor],
      queues: [
        BULLMQ_QUEUE.BROADCAST_TOPIC,
        BULLMQ_QUEUE.PERSIST_TOPIC,
        BULLMQ_QUEUE.VECTORIZE_TOPIC,
      ],
      useBullFactory: async ({ bullMQConfig }: BullMQConfigService) =>
        bullMQConfig,
    }),
    SocketIOModule.registerAsync({
      global: true,
      inject: [SocketIOConfigService],
      useFactory: async ({ socketIOConfig }: SocketIOConfigService) =>
        socketIOConfig,
    }),
  ],
})
export class MainModule {}
