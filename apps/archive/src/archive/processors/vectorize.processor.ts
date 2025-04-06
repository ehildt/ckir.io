import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';

import { MongoService } from '@/mongo/services/mongo.service';

import { BULLMQ_CHAT_QUEUE } from '../constants /bullmq.constants';
import { ChatMessageReq } from '../dtos/chat-message.dto.req';

@Processor(BULLMQ_CHAT_QUEUE.VECTORIZE)
export class VectorizeProcessor extends WorkerHost {
  constructor(
    private readonly archive: MongoService,
    private readonly logger: Logger,
  ) {
    super();
  }

  async process(job: Job<ChatMessageReq>) {
    await this.archive.log(job.data);
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
    this.logger.log(`${job.name}-Job failed processing ID ${job.id}; attempt(s) ${job.attemptsMade}`, 'BULLMQ:ARCHIVE');
  }
}
