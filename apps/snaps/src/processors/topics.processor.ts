import { BullMQLoggerService } from '@ckir.io/bullmq';
import { TopicsReq } from '@ckir.io/dtos';
import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

import { BULLMQ_JOB, BULLMQ_QUEUE } from '@/constants/bullmq.constants';
import { TopicsRepository } from '@/mongo/repositories/topic.repository';

@Processor(BULLMQ_QUEUE.PERSIST_TOPICS)
export class TopicsProcessor extends WorkerHost {
  constructor(
    private readonly bullMQLogger: BullMQLoggerService,
    private readonly tpcRepository: TopicsRepository,
  ) {
    super();
  }

  async process(job: Job<TopicsReq>) {
    if (job.name === BULLMQ_JOB.PERSIST) await this.tpcRepository.insertIfNotExists(job.data);
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
