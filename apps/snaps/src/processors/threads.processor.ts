import {
  BULLMQ_JOB,
  BULLMQ_QUEUE,
  BullMQPinoLoggerService,
} from '@ckir.io/bullmq';
import { ThreadsReq } from '@ckir.io/dtos';
import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

import { ThreadsRepository } from '@/mongo/repositories/threads.repository';

@Processor(BULLMQ_QUEUE.PERSIST_THREAD)
export class ThreadsProcessor extends WorkerHost {
  constructor(
    private readonly bullMQLogger: BullMQPinoLoggerService,
    private readonly thrRepository: ThreadsRepository,
  ) {
    super();
  }

  async process(job: Job<ThreadsReq>) {
    if (job.name === BULLMQ_JOB.PERSIST)
      await this.thrRepository.insertIfNotExists(job.data);
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
