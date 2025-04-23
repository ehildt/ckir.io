import { Logger, Module } from '@nestjs/common';

import { BullMQProcessorsModule } from './bullmq/bullmq.module';
import { ConfigFactoryModule } from './config-factory/config-factory.module';
import { ConfigFactoryService } from './config-factory/config-factory.service';
import { MessagesController } from './controllers/messages.controller';
import { ThreadsController } from './controllers/threads.controller';
import { TopicsController } from './controllers/topics.controller';
import { MongoModule } from './mongo/mongo.module';
import { MessagesService } from './services/messages.service';
import { ThreadsService } from './services/threads.service';
import { TopicsService } from './services/topics.service';

@Module({
  controllers: [MessagesController, TopicsController, ThreadsController],
  providers: [Logger, MessagesService, TopicsService, ThreadsService],
  imports: [
    ConfigFactoryModule.forRoot({ global: true }),
    BullMQProcessorsModule.registerAsync({
      global: true,
      inject: [ConfigFactoryService],
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
