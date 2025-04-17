import { Module } from '@nestjs/common';

import { BullMQProcessorsModule } from '@/bullmq-processors/bullmq-processors.module';
import { MongoModule } from '@/mongo/mongo.module';

import { PersistenceController } from './persistence.controller';
import { PersistenceService } from './persistence.service';

@Module({
  providers: [PersistenceService],
  controllers: [PersistenceController],
  imports: [MongoModule, BullMQProcessorsModule],
})
export class PersistenceModule {}
