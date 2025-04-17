import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

import { BullMQLoggerService } from '@/bullmq-logger/bullmq-logger.service';
import { BULLMQ_CHAT_JOB, BULLMQ_CHAT_QUEUE } from '@/constants/bullmq.constants';
import { MessageReq } from '@/dtos/message-req.dto';
import { SocketIOService } from '@/socket-io/socket-io.service';

@Processor(BULLMQ_CHAT_QUEUE.MESSAGE)
export class MessageProcessor extends WorkerHost {
  constructor(
    private readonly io: SocketIOService,
    private readonly logger: BullMQLoggerService,
  ) {
    super();
  }

  async process(job: Job<MessageReq>) {
    if (job.name !== BULLMQ_CHAT_JOB.MESSAGE) return;
    if (job.data.recipientId) this.io.emit(job.data.recipientId, job.data);
    this.io.emit(`${job.data.topicId}_${job.data.threadId}`, job.data);
  }

  @OnWorkerEvent('completed')
  async onCompleted(job: Job<MessageReq>) {
    await this.logger.log(job);
  }

  @OnWorkerEvent('failed')
  async onFailed(job: Job<MessageReq>) {
    await this.logger.error(job);
  }
}
