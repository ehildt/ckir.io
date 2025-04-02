import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';

import { BULLMQ_PERSISTANCE_QUEUE } from '@/constants/app.constants';
import { Message } from '@/dtos/message.dto';
import { ChatArchiveService } from '@/services/chat-hub-archive.service';

@Processor(BULLMQ_PERSISTANCE_QUEUE)
export class PersistProcessor extends WorkerHost {
  constructor(
    private readonly archive: ChatArchiveService,
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
