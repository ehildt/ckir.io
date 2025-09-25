import { BullMQLoggerService } from '@ckir.io/bullmq';
import { ThreadReq } from '@ckir.io/dtos';
import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

import { BULLMQ_JOB, BULLMQ_QUEUE } from '@/constants/bullmq.constants';
import { ThreadRepository } from '@/mongo/repositories/thread.repository';

@Processor(BULLMQ_QUEUE.PERSIST_THREAD)
export class PstThrProcessor extends WorkerHost {
  constructor(
    private readonly bullMQLogger: BullMQLoggerService,
    private readonly thrRepository: ThreadRepository,
  ) {
    super();
  }

  async process(job: Job<ThreadReq>) {
    if (job.name === BULLMQ_JOB.PERSIST) await this.thrRepository.insertOne(job.data);
  }

  @OnWorkerEvent('completed')
  async onCompleted(job: Job) {
    await this.bullMQLogger.log(job);
  }

  @OnWorkerEvent('failed')
  async onFailed(job: Job) {
    await this.bullMQLogger.error(job);
  }
}
