import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

import { BullMQLoggerService } from '@/bullmq-logger/bullmq-logger.service';
import { BULLMQ_JOB, BULLMQ_QUEUE } from '@/constants/bullmq.constants';
import { TopicReq } from '@/dtos/topic-req.dto';
import { TopicRepository } from '@/mongo/repositories/topic.repository';

@Processor(BULLMQ_QUEUE.PERSIST_TOPIC)
export class PstTpcProcessor extends WorkerHost {
  constructor(
    private readonly bullMQLogger: BullMQLoggerService,
    private readonly tpcRepository: TopicRepository,
  ) {
    super();
  }

  async process(job: Job<TopicReq>) {
    if (job.name === BULLMQ_JOB.PERSIST) await this.tpcRepository.insertOne(job.data);
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
