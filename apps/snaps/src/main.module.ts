import {
  BULLMQ_QUEUE,
  BullMQModule,
  BullMQPinoLoggerModule,
} from '@ehildt/ckir-bullmq';
import { ConfigFactoryModule } from '@ehildt/ckir-config-factory';
import { Logger, Module } from '@nestjs/common';

import { AppConfigService } from './configs/app-config.service';
import { BullMQConfigService } from './configs/bullmq-config.service';
import { MongoConfigService } from './configs/mongo-config.service';
import { PostsController } from './controllers/posts.controller';
import { ThreadsController } from './controllers/threads.controller';
import { TopicsController } from './controllers/topics.controller';
import { MongoModule } from './mongo/mongo.module';
import { PostsProcessor } from './processors/posts.processor';
import { ThreadsProcessor } from './processors/threads.processor';
import { TopicsProcessor } from './processors/topics.processor';
import { PostsService } from './services/posts.service';
import { ThreadsService } from './services/threads.service';
import { TopicsService } from './services/topics.service';

@Module({
  controllers: [PostsController, TopicsController, ThreadsController],
  providers: [Logger, PostsService, TopicsService, ThreadsService],
  imports: [
    ConfigFactoryModule.forRoot({
      global: true,
      providers: [AppConfigService, BullMQConfigService, MongoConfigService],
    }),
    BullMQPinoLoggerModule.registerAsync({
      inject: [BullMQConfigService],
      useFactory: async ({ pinoConfig }: BullMQConfigService) => pinoConfig,
    }),
    BullMQModule.registerAsync({
      global: true,
      inject: [BullMQConfigService],
      queues: [
        BULLMQ_QUEUE.PERSIST_POST,
        BULLMQ_QUEUE.PERSIST_THREAD,
        BULLMQ_QUEUE.PERSIST_TOPIC,
      ],
      processors: [PostsProcessor, ThreadsProcessor, TopicsProcessor],
      usePinoFactory: async ({ pinoConfig }: BullMQConfigService) => pinoConfig,
      useBullFactory: async ({ bullMQConfig }: BullMQConfigService) =>
        bullMQConfig,
    }),
    MongoModule.registerAsync({
      global: true,
      inject: [MongoConfigService],
      useFactory: async ({ mongoConfig }: MongoConfigService) => mongoConfig,
    }),
  ],
})
export class MainModule {}
