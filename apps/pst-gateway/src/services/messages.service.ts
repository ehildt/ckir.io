import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { Queue } from 'bullmq';

import { BULLMQ_JOB, BULLMQ_QUEUE } from '@/constants/bullmq.constants';
import { GatewayMode } from '@/constants/gateway-mode.constants';
import { MessageReq } from '@/dtos/message-req.dto';
import { MessageFilter, MessageRepository } from '@/mongo/repositories/message.repository';

@Injectable()
export class MessagesService {
  constructor(
    private readonly messageRepository: MessageRepository,
    @InjectQueue(BULLMQ_QUEUE.PERSIST_MESSAGE) private readonly pstMsgQueue: Queue,
  ) {}

  async insertOneQueued(req: MessageReq, mode: GatewayMode) {
    if (mode !== GatewayMode.PERSIST) throw new UnprocessableEntityException();
    await this.pstMsgQueue.add(BULLMQ_JOB.PERSIST, req);
  }

  async messages(threadId: string, filter?: MessageFilter) {
    return this.messageRepository.findAll(threadId, filter);
  }

  async attachments(messageId: string, threadId: string, filter?: MessageFilter) {
    return (await this.messageRepository.findAllAttachments(messageId, threadId, filter)).attachments;
  }
}
