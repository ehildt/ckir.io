import {
  BULLMQ_JOB,
  BULLMQ_QUEUE,
  BullMQPinoLoggerService,
} from '@ehildt/ckir-bullmq';
import { PostsReq } from '@ehildt/ckir-dtos';
import { SocketIOService } from '@ehildt/ckir-socket-io';
import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

@Processor(BULLMQ_QUEUE.BROADCAST_POST)
export class PostsProcessor extends WorkerHost {
  constructor(
    private readonly io: SocketIOService,
    private readonly logger: BullMQPinoLoggerService,
  ) {
    super();
  }

  async process(job: Job<PostsReq>) {
    if (job.name !== BULLMQ_JOB.DISPATCH) return;
    if (job.data.recipientId) this.io.emit(job.data.recipientId, job.data);
    else this.io.emit(`${job.data.topicId}_${job.data.threadId}`, job.data);
  }

  @OnWorkerEvent('completed')
  async onCompleted(job: Job<PostsReq>) {
    await this.logger.log(job);
  }

  @OnWorkerEvent('failed')
  async onFailed(job: Job<PostsReq>) {
    await this.logger.error(job);
  }
}
