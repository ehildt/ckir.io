import { BullMQLoggerService } from '@ckir.io/bullmq';
import { MessageReq } from '@ckir.io/dtos';
import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

import { BULLMQ_JOB, BULLMQ_QUEUE } from '@/constants/bullmq.constants';
import { MessageRepository } from '@/mongo/repositories/message.repository';

@Processor(BULLMQ_QUEUE.PERSIST_MESSAGE)
export class PstMsgProcessor extends WorkerHost {
  constructor(
    private readonly bullMQLogger: BullMQLoggerService,
    private readonly msgRepository: MessageRepository,
  ) {
    super();
  }

  async process(job: Job<MessageReq>) {
    if (job.name === BULLMQ_JOB.PERSIST) await this.msgRepository.insertOne(job.data);
  }

  @OnWorkerEvent('completed')
  async onCompleted(job: Job<MessageReq>) {
    await this.bullMQLogger.log(job);
  }

  @OnWorkerEvent('failed')
  async onFailed(job: Job<MessageReq>) {
    await this.bullMQLogger.error(job);
  }
}
