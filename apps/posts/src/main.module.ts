import { BullMQModule } from '@ckir.io/bullmq';
import { SocketIOModule } from '@ckir.io/socket-io';
import { Logger, Module } from '@nestjs/common';

import { ConfigFactoryModule } from './config-factory/config-factory.module';
import { ConfigFactoryService } from './config-factory/config-factory.service';
import { BULLMQ_QUEUE } from './constants/bullmq.constants';
import { PostsController } from './controllers/posts.controller';
import { PostsProcessor } from './processors/posts.processor';
import { PostsService } from './services/posts.service';

@Module({
  imports: [
    ConfigFactoryModule.forRoot({ global: true }),
    BullMQModule.registerAsync({
      global: true,
      inject: [ConfigFactoryService],
      processors: [PostsProcessor],
      queues: [
        BULLMQ_QUEUE.BROADCAST_POSTS,
        BULLMQ_QUEUE.PERSIST_POSTS,
        BULLMQ_QUEUE.VECTORIZE_POSTS,
      ],
      usePinoFactory: async ({ pinoConfig }: ConfigFactoryService) =>
        pinoConfig,
      useBullFactory: async ({ bullMQConfig }: ConfigFactoryService) =>
        bullMQConfig,
    }),
    SocketIOModule.registerAsync({
      global: true,
      inject: [ConfigFactoryService],
      useFactory: async ({ socketIOConfig }: ConfigFactoryService) =>
        socketIOConfig,
    }),
  ],
  providers: [Logger, PostsService],
  controllers: [PostsController],
})
export class MainModule {}
