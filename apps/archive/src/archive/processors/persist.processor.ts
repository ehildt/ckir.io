import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';

import { MongoService } from '@/mongo/services/mongo.service';

import { BULLMQ_CHAT_QUEUE } from '../constants /bullmq.constants';
import { MessageReq } from '../dtos/message-req.dto';

@Processor(BULLMQ_CHAT_QUEUE.PERSIST)
export class PersistProcessor extends WorkerHost {
  constructor(
    private readonly archive: MongoService,
    private readonly logger: Logger,
  ) {
    super();
  }

  async process(job: Job<MessageReq>) {
    await this.archive.insert(job.data);
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    this.logger.log(
      `${job.name}-Job completed processing ID ${job.id}; attempt(s) ${job.attemptsMade}`,
      'BULLMQ:ARCHIVE',
    );
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job) {
    this.logger.error(
      `${job.name}-Job failed processing ID ${job.id}; attempt(s) ${job.attemptsMade}`,
      'BULLMQ:ARCHIVE',
    );
    this.logger.error(job.stacktrace);
  }
}
