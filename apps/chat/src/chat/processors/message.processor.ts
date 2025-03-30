import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';

import { SocketIOService } from '@/socket-io/socket-io.service';

import { BULLMQ_CHAT_JOB, BULLMQ_CHAT_QUEUE } from '../constants/bullmq.constants';
import { ChatMessageReq } from '../dtos/chat-message.dto.req';

@Processor(BULLMQ_CHAT_QUEUE.MESSAGE)
export class MessageProcessor extends WorkerHost {
  constructor(
    private readonly io: SocketIOService,
    private readonly logger: Logger,
  ) {
    super();
  }

  async process(job: Job<ChatMessageReq>) {
    if (job.name !== BULLMQ_CHAT_JOB.MESSAGE) return;
    if (job.data.thread?.id) this.io.emit(`${job.data.topic.id}_${job.data.thread.id}`, job.data);
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    this.logger.log(`Job "${job.name}-${job.id}" completed`, 'BULLMQ');
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job) {
    this.logger.error(`Job "${job.name}-${job.id}" failed`, 'BULLMQ');
  }
}
