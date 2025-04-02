import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Queue } from 'bullmq';

import { ChatMessageReq } from '@/chat/dtos/chat-message.dto.req';

import { SocketIOService } from '../../socket-io/socket-io.service';
import { BULLMQ_CHAT_JOB, BULLMQ_CHAT_QUEUE, SOCKET_IO_EVENT } from '../constants/bullmq.constants';

export class EmitEventError extends Error {
  constructor(message?: string, cause?: unknown) {
    super(message, { cause });
    this.name = this.constructor.name;
  }
}

@Injectable()
export class ChatService implements OnModuleInit {
  constructor(
    private readonly logger: Logger,
    private readonly io: SocketIOService,
    @InjectQueue(BULLMQ_CHAT_QUEUE.PERSIST) private readonly persistQueue: Queue,
    @InjectQueue(BULLMQ_CHAT_QUEUE.MESSAGE) private readonly messageQueue: Queue,
    @InjectQueue(BULLMQ_CHAT_QUEUE.VECTORIZE) private readonly vectorizeQueue: Queue,
  ) {}

  async onModuleInit() {
    this.io.on<ChatMessageReq>(SOCKET_IO_EVENT.MESSAGE, async ({ data }) => await this.emit(data));
  }

  async emit(message: ChatMessageReq) {
    try {
      if (message.args.persist) await this.persistQueue.add(BULLMQ_CHAT_JOB.PERSIST, message);
      if (message.args.vectorize) await this.vectorizeQueue.add(BULLMQ_CHAT_JOB.VECTORIZE, message);
      await this.messageQueue.add(BULLMQ_CHAT_JOB.MESSAGE, message);
    } catch (error) {
      this.logger.error(new EmitEventError(`Error emitting event to BULLMQ`, error));
    }
  }
}
