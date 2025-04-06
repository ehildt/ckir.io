import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Queue } from 'bullmq';

import { SocketIOService } from '../socket-io/socket-io.service';
import { BULLMQ_CHAT_JOB, BULLMQ_CHAT_QUEUE, SOCKET_IO_EVENT } from './constants/bullmq.constants';
import { MessageMode } from './constants/message-req.constants';
import { MessageReq } from './dtos/message-req.dto';

export class EmitEventError extends Error {
  constructor(message?: string, cause?: unknown) {
    super(message, { cause });
    this.name = this.constructor.name;
  }
}

@Injectable()
export class MessageGatewayService implements OnModuleInit {
  constructor(
    private readonly logger: Logger,
    private readonly io: SocketIOService,
    @InjectQueue(BULLMQ_CHAT_QUEUE.PERSIST) private readonly persistQueue: Queue,
    @InjectQueue(BULLMQ_CHAT_QUEUE.MESSAGE) private readonly messageQueue: Queue,
    @InjectQueue(BULLMQ_CHAT_QUEUE.VECTORIZE) private readonly vectorizeQueue: Queue,
  ) {}

  async onModuleInit() {
    this.io.on<MessageReq>(SOCKET_IO_EVENT.MESSAGE, async ({ data }) => await this.emit(data));
  }

  async emit(message: MessageReq) {
    try {
      await this.messageQueue.add(BULLMQ_CHAT_JOB.MESSAGE, message);
      if (message.mode === MessageMode.PERSIST) await this.persistQueue.add(BULLMQ_CHAT_JOB.PERSIST, message);
      if (message.mode === MessageMode.VECTORIZE) {
        await this.persistQueue.add(BULLMQ_CHAT_JOB.PERSIST, message);
        await this.vectorizeQueue.add(BULLMQ_CHAT_JOB.VECTORIZE, message);
      }
    } catch (error) {
      this.logger.error(new EmitEventError(`Error emitting event to BULLMQ`, error));
    }
  }
}
