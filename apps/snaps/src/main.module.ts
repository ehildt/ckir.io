import { BullMQModule } from '@ckir.io/bullmq';
import { Logger, Module } from '@nestjs/common';

import { ConfigFactoryModule } from './config-factory/config-factory.module';
import { ConfigFactoryService } from './config-factory/config-factory.service';
import { BULLMQ_QUEUE } from './constants/bullmq.constants';
import { MessagesController } from './controllers/messages.controller';
import { ThreadsController } from './controllers/threads.controller';
import { TopicsController } from './controllers/topics.controller';
import { MongoModule } from './mongo/mongo.module';
import { PstMsgProcessor } from './processors/pst-msg.processor';
import { PstThrProcessor } from './processors/pst-thr.processor';
import { PstTpcProcessor } from './processors/pst-tpc.processor';
import { MessagesService } from './services/messages.service';
import { ThreadsService } from './services/threads.service';
import { TopicsService } from './services/topics.service';

@Module({
  controllers: [MessagesController, TopicsController, ThreadsController],
  providers: [Logger, MessagesService, TopicsService, ThreadsService],
  imports: [
    ConfigFactoryModule.forRoot({ global: true }),
    BullMQModule.registerAsync({
      global: true,
      inject: [ConfigFactoryService],
      queues: [BULLMQ_QUEUE.PERSIST_MESSAGE, BULLMQ_QUEUE.PERSIST_THREAD, BULLMQ_QUEUE.PERSIST_TOPIC],
      processors: [PstMsgProcessor, PstThrProcessor, PstTpcProcessor],
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
