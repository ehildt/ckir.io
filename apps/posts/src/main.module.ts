import {
  BULLMQ_QUEUE,
  BullMQModule,
  BullMQPinoLoggerModule,
} from '@ehildt/ckir-bullmq';
import { ConfigFactoryModule } from '@ehildt/ckir-config-factory';
import { SocketIOModule } from '@ehildt/ckir-socket-io';
import { Logger, Module } from '@nestjs/common';

import { AppConfigService } from './configs/app-config.service';
import { BullMQConfigService } from './configs/bullmq-config.service';
import { SocketIOConfigService } from './configs/socket-io-config.service';
import { PostsController } from './controllers/posts.controller';
import { PostsProcessor } from './processors/posts.processor';
import { PostsService } from './services/posts.service';

@Module({
  controllers: [PostsController],
  providers: [Logger, PostsService],
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
      processors: [PostsProcessor],
      queues: [
        BULLMQ_QUEUE.PERSIST_POST,
        BULLMQ_QUEUE.BROADCAST_POST,
        BULLMQ_QUEUE.VECTORIZE_POST,
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
