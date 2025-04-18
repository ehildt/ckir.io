import { Logger, Module } from '@nestjs/common';

import { BullMQProcessorsModule } from './bullmq-processors/bullmq-processors.module';
import { ConfigFactoryModule } from './config-factory/config-factory.module';
import { ConfigFactoryService } from './config-factory/config-factory.service';
import { GatewayController } from './controllers/gateway.controller';
import { MessagesController } from './controllers/messages.controller';
import { ThreadsController } from './controllers/threads.controller';
import { TopicsController } from './controllers/topics.controller';
import { MainService } from './main.service';
import { MongoModule } from './mongo/mongo.module';
import { MessagesService } from './services/messages.service';
import { ThreadsService } from './services/threads.service';
import { TopicsService } from './services/topics.service';

@Module({
  controllers: [GatewayController, MessagesController, TopicsController, ThreadsController],
  providers: [Logger, MainService, MessagesService, TopicsService, ThreadsService],
  imports: [
    ConfigFactoryModule.forRoot({ isGlobal: true }),
    BullMQProcessorsModule.registerAsync({
      isGlobal: true,
      inject: [ConfigFactoryService],
      usePinoFactory: async ({ pinoConfig }: ConfigFactoryService) => pinoConfig,
      useBullFactory: async ({ bullMQConfig }: ConfigFactoryService) => bullMQConfig,
    }),
    MongoModule.registerAsync({
      isGlobal: true,
      inject: [ConfigFactoryService],
      useFactory: async ({ mongoConfig }: ConfigFactoryService) => mongoConfig,
    }),
  ],
})
export class MainModule {}
