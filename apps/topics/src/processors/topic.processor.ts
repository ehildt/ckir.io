import { BULLMQ_JOB, BULLMQ_QUEUE } from '@ehildt/ckir-bullmq';
import { BullMQPinoLoggerService } from '@ehildt/ckir-bullmq-logger';
import { TopicsReq } from '@ehildt/ckir-dtos';
import { SocketIOService } from '@ehildt/ckir-socket-io';
import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

@Processor(BULLMQ_QUEUE.BROADCAST_TOPIC)
export class TopicProcessor extends WorkerHost {
  constructor(
    private readonly io: SocketIOService,
    private readonly logger: BullMQPinoLoggerService,
  ) {
    super();
  }

  async process(job: Job<TopicsReq>) {
    if (job.name !== BULLMQ_JOB.DISPATCH) return;
    this.io.emit(job.data.publisherId, job.data);
  }

  @OnWorkerEvent('completed')
  async onCompleted(job: Job<TopicsReq>) {
    await this.logger.log(job);
  }

  @OnWorkerEvent('failed')
  async onFailed(job: Job<TopicsReq>) {
    await this.logger.error(job);
  }
}
