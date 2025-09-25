import { BullMQModule } from '@ckir.io/bullmq';
import { Logger, Module } from '@nestjs/common';

import { ConfigFactoryModule } from './config-factory/config-factory.module';
import { ConfigFactoryService } from './config-factory/config-factory.service';
import { BULLMQ_QUEUE } from './constants/bullmq.constants';
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
    ConfigFactoryModule.forRoot({ global: true }),
    BullMQModule.registerAsync({
      global: true,
      inject: [ConfigFactoryService],
      queues: [BULLMQ_QUEUE.PERSIST_POSTS, BULLMQ_QUEUE.PERSIST_THREADS, BULLMQ_QUEUE.PERSIST_TOPICS],
      processors: [PostsProcessor, ThreadsProcessor, TopicsProcessor],
      usePinoFactory: async ({ pinoConfig }: ConfigFactoryService) => pinoConfig,
      useBullFactory: async ({ bullMQConfig }: ConfigFactoryService) => bullMQConfig,
    }),
    MongoModule.registerAsync({
      global: true,
      inject: [ConfigFactoryService],
      useFactory: async ({ mongoConfig }: ConfigFactoryService) => mongoConfig,
    }),
  ],
})
export class MainModule {}
