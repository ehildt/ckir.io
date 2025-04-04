import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';

import { BULLMQ_VECTORIZE_QUEUE } from '@/archive/constants /app.constants';
import { Message } from '@/archive/dtos/message.dto';
import { MongoService } from '@/mongo/services/mongo.service';

@Processor(BULLMQ_VECTORIZE_QUEUE)
export class VectorizeProcessor extends WorkerHost {
  constructor(
    private readonly archive: MongoService,
    private readonly logger: Logger,
  ) {
    super();
  }

  async process(job: Job<Message>) {
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
