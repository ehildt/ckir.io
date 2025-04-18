import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Queue } from 'bullmq';

import { BULLMQ_JOB, BULLMQ_QUEUE } from '@/constants/bullmq.constants';
import { SOCKET_IO_EVENT } from '@/constants/socket-io.constants';
import { MessageReq } from '@/dtos/message-req.dto';

import { GatewayMode } from '../constants/gateway-mode.constants';
import { SocketIOService } from '../socket-io/socket-io.service';

export class EmitEventError extends Error {
  constructor(message?: string, cause?: unknown) {
    super(message, { cause });
    this.name = this.constructor.name;
  }
}

@Injectable()
export class MessagesService implements OnModuleInit {
  constructor(
    private readonly logger: Logger,
    private readonly io: SocketIOService,
    @InjectQueue(BULLMQ_QUEUE.PERSIST_MESSAGE) private readonly persistQueue: Queue,
    @InjectQueue(BULLMQ_QUEUE.BROADCAST_MESSAGE) private readonly messageQueue: Queue,
    @InjectQueue(BULLMQ_QUEUE.VECTORIZE_MESSAGE) private readonly vectorizeQueue: Queue,
  ) {}

  async onModuleInit() {
    this.io.on<MessageReq>(SOCKET_IO_EVENT.MESSAGE, async ({ data }) => await this.emit(data));
  }

  async emit(message: MessageReq, gateway?: GatewayMode) {
    try {
      await this.messageQueue.add(BULLMQ_JOB.MESSAGE, message);
      if (gateway === GatewayMode.PERSIST) await this.persistQueue.add(BULLMQ_JOB.PERSIST, message);
      if (gateway === GatewayMode.VECTORIZE) await this.vectorizeQueue.add(BULLMQ_JOB.VECTORIZE, message);
    } catch (error) {
      this.logger.error(new EmitEventError(`Error emitting event to BULLMQ`, error));
    }
  }
}
