import { BULLMQ_JOB, BULLMQ_QUEUE } from '@ehildt/ckir-bullmq';
import { BullMQPinoLoggerService } from '@ehildt/ckir-bullmq-logger';
import { TopicsReq } from '@ehildt/ckir-dtos';
import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

import { TopicsRepository } from '@/mongo/repositories/topic.repository';

@Processor(BULLMQ_QUEUE.PERSIST_TOPIC)
export class TopicsProcessor extends WorkerHost {
  constructor(
    private readonly bullMQLogger: BullMQPinoLoggerService,
    private readonly tpcRepository: TopicsRepository,
  ) {
    super();
  }

  async process(job: Job<TopicsReq>) {
    if (job.name === BULLMQ_JOB.PERSIST)
      await this.tpcRepository.insertIfNotExists(job.data);
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
