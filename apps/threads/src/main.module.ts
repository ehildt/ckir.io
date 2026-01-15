import { BULLMQ_QUEUE, BullMQModule } from '@ehildt/ckir-bullmq';
import { BullMQPinoLoggerModule } from '@ehildt/ckir-bullmq-logger';
import { ConfigFactoryModule } from '@ehildt/ckir-config-factory';
import { SocketIOModule } from '@ehildt/ckir-socket-io';
import { Logger, Module } from '@nestjs/common';

import { AppConfigService } from './configs/app-config.service';
import { BullMQConfigService } from './configs/bullmq-config.service';
import { SocketIOConfigService } from './configs/socket-io-config.service';
import { ThreadsController } from './controllers/threads.controller';
import { ThreadsProcessor } from './processors/threads.processor';
import { ThreadsVectorizeProcessor } from './processors/threads.vectorize.processor';
import { ThreadsService } from './services/threads.service';

@Module({
  controllers: [ThreadsController],
  providers: [Logger, ThreadsService],
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
      queues: [
        BULLMQ_QUEUE.BROADCAST_THREAD,
        BULLMQ_QUEUE.PERSIST_THREAD,
        BULLMQ_QUEUE.VECTORIZE_THREAD,
      ],
      processors: [ThreadsProcessor, ThreadsVectorizeProcessor],
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
