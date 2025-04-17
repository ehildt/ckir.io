import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';

import { BullMQLoggerModule } from '@/bullmq-logger/bullmq-logger.module';
import { ConfigFactoryService } from '@/config-factory/config-factory.service';

import { BULLMQ_CHAT_QUEUE } from '../constants/bullmq.constants';
import { PersistProcessor } from './persist.processor';

@Module({
  providers: [PersistProcessor],
  imports: [
    BullMQLoggerModule.register({
      inject: [ConfigFactoryService],
      useFactory: ({ pinoConfig }: ConfigFactoryService) => pinoConfig,
    }),
    BullModule.registerQueueAsync({
      name: BULLMQ_CHAT_QUEUE.PERSIST,
      inject: [ConfigFactoryService],
      useFactory: async ({ bullMQConfig }: ConfigFactoryService) => bullMQConfig,
    }),
  ],
  exports: [BullModule],
})
export class BullMQProcessorsModule {}
