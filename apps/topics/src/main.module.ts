import {
  BULLMQ_QUEUE,
  BullMQModule,
  BullMQPinoLoggerModule,
} from '@ckir.io/bullmq';
import { ConfigFactoryModule } from '@ckir.io/config-factory';
import { SocketIOModule } from '@ckir.io/socket-io';
import { Logger, Module } from '@nestjs/common';

import { AppConfigService } from './configs/app-config.service';
import { BullMQConfigService } from './configs/bullmq-config.service';
import { SocketIOConfigService } from './configs/socket-io-config.service';
import { TopicsController } from './controllers/topics.controller';
import { TopicProcessor } from './processors/topic.processor';
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
      inject: [BullMQConfigService],
      useFactory: async ({ pinoConfig }: BullMQConfigService) => pinoConfig,
    }),
    BullMQModule.registerAsync({
      global: true,
      inject: [BullMQConfigService],
      processors: [TopicProcessor],
      queues: [
        BULLMQ_QUEUE.BROADCAST_TOPIC,
        BULLMQ_QUEUE.PERSIST_TOPIC,
        BULLMQ_QUEUE.VECTORIZE_TOPIC,
      ],
      usePinoFactory: async ({ pinoConfig }: BullMQConfigService) => pinoConfig,
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
