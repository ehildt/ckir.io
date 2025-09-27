import { BullMQLoggerService } from '@ckir.io/bullmq';
import { PostsReq } from '@ckir.io/dtos';
import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

import { BULLMQ_JOB, BULLMQ_QUEUE } from '@/constants/bullmq.constants';
import { PostsRepository } from '@/mongo/repositories/posts.repository';

@Processor(BULLMQ_QUEUE.PERSIST_POSTS)
export class PostsProcessor extends WorkerHost {
  constructor(
    private readonly bullMQLogger: BullMQLoggerService,
    private readonly msgRepository: PostsRepository,
  ) {
    super();
  }

  async process(job: Job<PostsReq>) {
    if (job.name === BULLMQ_JOB.PERSIST) await this.msgRepository.insertIfNotExists(job.data);
  }

  @OnWorkerEvent('completed')
  async onCompleted(job: Job<PostsReq>) {
    await this.bullMQLogger.log(job);
  }

  @OnWorkerEvent('failed')
  async onFailed(job: Job<PostsReq>) {
    await this.bullMQLogger.error(job);
  }
}
