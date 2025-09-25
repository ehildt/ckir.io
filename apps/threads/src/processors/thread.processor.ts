import { BullMQLoggerService } from '@ckir.io/bullmq';
import { ThreadReq } from '@ckir.io/dtos';
import { SocketIOService } from '@ckir.io/socket-io';
import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

import { BULLMQ_JOB, BULLMQ_QUEUE } from '@/constants/bullmq.constants';

@Processor(BULLMQ_QUEUE.BROADCAST_THREAD)
export class ThreadProcessor extends WorkerHost {
  constructor(
    private readonly io: SocketIOService,
    private readonly logger: BullMQLoggerService,
  ) {
    super();
  }

  async process(job: Job<ThreadReq>) {
    if (job.name !== BULLMQ_JOB.DISPATCH) return;
    this.io.emit(job.data.publisherId, job.data);
  }

  @OnWorkerEvent('completed')
  async onCompleted(job: Job<ThreadReq>) {
    await this.logger.log(job);
  }

  @OnWorkerEvent('failed')
  async onFailed(job: Job<ThreadReq>) {
    await this.logger.error(job);
  }
}
