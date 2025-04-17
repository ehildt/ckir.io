import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

import { BullMQLoggerService } from '@/bullmq-logger/bullmq-logger.service';
import { BULLMQ_CHAT_QUEUE } from '@/constants/bullmq.constants';
import { MessageReq } from '@/dtos/message-req.dto';
import { MongoService } from '@/mongo/services/mongo.service';

@Processor(BULLMQ_CHAT_QUEUE.PERSIST)
export class PersistProcessor extends WorkerHost {
  constructor(
    private readonly mongo: MongoService,
    private readonly logger: BullMQLoggerService,
  ) {
    super();
  }

  async process(job: Job<MessageReq>) {
    await this.mongo.insert(job.data);
  }

  @OnWorkerEvent('completed')
  async onCompleted(job: Job) {
    await this.logger.log(job);
  }

  @OnWorkerEvent('failed')
  async onFailed(job: Job) {
    await this.logger.error(job);
  }
}
