import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

import { BullMQLoggerService } from '@/bullmq-logger/bullmq-logger.service';
import { BULLMQ_JOB, BULLMQ_QUEUE } from '@/constants/bullmq.constants';
import { ThreadReq } from '@/dtos/thread-req.dto';
import { SocketIOService } from '@/socket-io/socket-io.service';

@Processor(BULLMQ_QUEUE.BROADCAST_THREAD)
export class ThreadProcessor extends WorkerHost {
  constructor(
    private readonly io: SocketIOService,
    private readonly logger: BullMQLoggerService,
  ) {
    super();
  }

  async process(job: Job<ThreadReq>) {
    if (job.name !== BULLMQ_JOB.MESSAGE) return;
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
