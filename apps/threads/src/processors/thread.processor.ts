import { BullMQPinoLoggerService } from '@ckir.io/bullmq';
import { ThreadsReq } from '@ckir.io/dtos';
import { SocketIOService } from '@ckir.io/socket-io';
import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

import { BULLMQ_JOB, BULLMQ_QUEUE } from '@/constants/bullmq.constants';

@Processor(BULLMQ_QUEUE.BROADCAST_THREAD)
export class ThreadProcessor extends WorkerHost {
  constructor(
    private readonly io: SocketIOService,
    private readonly logger: BullMQPinoLoggerService,
  ) {
    super();
  }

  async process(job: Job<ThreadsReq>) {
    if (job.name !== BULLMQ_JOB.DISPATCH) return;
    this.io.emit(job.data.publisherId, job.data);
  }

  @OnWorkerEvent('completed')
  async onCompleted(job: Job<ThreadsReq>) {
    await this.logger.log(job);
  }

  @OnWorkerEvent('failed')
  async onFailed(job: Job<ThreadsReq>) {
    await this.logger.error(job);
  }
}
