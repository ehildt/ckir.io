import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';

import { SocketIOService } from '@/socket-io/socket-io.service';

import { BULLMQ_CHAT_JOB, BULLMQ_CHAT_QUEUE } from './constants/bullmq.constants';
import { MessageReq } from './dtos/message-req.dto';

@Processor(BULLMQ_CHAT_QUEUE.MESSAGE)
export class MessageGatewayProcessor extends WorkerHost {
  constructor(
    private readonly io: SocketIOService,
    private readonly logger: Logger,
  ) {
    super();
  }

  async process(job: Job<MessageReq>) {
    if (job.name !== BULLMQ_CHAT_JOB.MESSAGE) return;
    if (job.data.recipientId) this.io.emit(job.data.recipientId, job.data);
    this.io.emit(`${job.data.topicId}_${job.data.threadId}`, job.data);
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    this.logger.log(`${job.name}-Job completed processing ID ${job.id}; attempt(s) ${job.attemptsMade}`, 'BULLMQ:CHAT');
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job) {
    this.logger.error(`${job.name}-Job failed processing ID ${job.id}; attempt(s) ${job.attemptsMade}`, 'BULLMQ:CHAT');
  }
}
