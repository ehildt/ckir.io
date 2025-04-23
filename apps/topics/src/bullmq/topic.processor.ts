import { TopicReq } from '@ckir.io/dtos';
import { SocketIOService } from '@ckir.io/socket-io';
import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

import { BullMQLoggerService } from '@/bullmq-logger/bullmq-logger.service';
import { BULLMQ_JOB, BULLMQ_QUEUE } from '@/constants/bullmq.constants';

@Processor(BULLMQ_QUEUE.BROADCAST_TOPIC)
export class TopicProcessor extends WorkerHost {
  constructor(
    private readonly io: SocketIOService,
    private readonly logger: BullMQLoggerService,
  ) {
    super();
  }

  async process(job: Job<TopicReq>) {
    if (job.name !== BULLMQ_JOB.DISPATCH) return;
    this.io.emit(job.data.publisherId, job.data);
  }

  @OnWorkerEvent('completed')
  async onCompleted(job: Job<TopicReq>) {
    await this.logger.log(job);
  }

  @OnWorkerEvent('failed')
  async onFailed(job: Job<TopicReq>) {
    await this.logger.error(job);
  }
}
