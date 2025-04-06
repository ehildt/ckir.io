import { BullModule } from '@nestjs/bullmq';
import { Logger, Module } from '@nestjs/common';

import { ArchiveController } from '@/archive/controllers/archive.controller';
import { PersistProcessor } from '@/archive/processors/persist.processor';
import { VectorizeProcessor } from '@/archive/processors/vectorize.processor';
import { ConfigFactoryService } from '@/config-factory/config-factory.service';
import { MongoModule } from '@/mongo/mongo.module';

import { BULLMQ_CHAT_QUEUE } from './constants /bullmq.constants';

@Module({
  imports: [
    MongoModule,
    BullModule.registerQueueAsync(
      {
        inject: [ConfigFactoryService],
        name: BULLMQ_CHAT_QUEUE.PERSIST,
        useFactory: async ({ bullMQConfig }: ConfigFactoryService) => bullMQConfig,
      },
      {
        inject: [ConfigFactoryService],
        name: BULLMQ_CHAT_QUEUE.VECTORIZE,
        useFactory: async ({ bullMQConfig }: ConfigFactoryService) => bullMQConfig,
      },
    ),
  ],
  providers: [PersistProcessor, VectorizeProcessor, Logger],
  controllers: [ArchiveController],
})
export class ArchiveModule {}
