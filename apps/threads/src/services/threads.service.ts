import { ThreadReq } from '@ckir.io/dtos';
import { SocketIOService } from '@ckir.io/socket-io';
import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Queue } from 'bullmq';

import { BULLMQ_JOB, BULLMQ_QUEUE } from '@/constants/bullmq.constants';
import { GatewayMode } from '@/constants/gateway-mode.constants';
import { SOCKET_IO_EVENT } from '@/constants/socket-io.constants';
import { EmitEventError } from '@/errors/emit-event.error';

@Injectable()
export class ThreadsService implements OnModuleInit {
  constructor(
    private readonly logger: Logger,
    private readonly io: SocketIOService,
    @InjectQueue(BULLMQ_QUEUE.PERSIST_THREAD)
    private readonly persistQueue: Queue,
    @InjectQueue(BULLMQ_QUEUE.VECTORIZE_THREAD)
    private readonly vectorizeQueue: Queue,
    @InjectQueue(BULLMQ_QUEUE.BROADCAST_THREAD)
    private readonly broadcastQueue: Queue,
  ) {}

  async onModuleInit() {
    this.io.on<ThreadReq>(SOCKET_IO_EVENT.THREAD, async ({ data }) => await this.emit(data));
  }

  async emit(req: ThreadReq, mode?: GatewayMode) {
    try {
      await this.broadcastQueue.add(BULLMQ_JOB.DISPATCH, req);
    } catch (error) {
      this.logger.error(new EmitEventError(`Error emitting event to BULLMQ: ${BULLMQ_QUEUE.BROADCAST_THREAD}`, error));
    }

    try {
      if (mode === GatewayMode.PERSIST) await this.persistQueue.add(BULLMQ_JOB.PERSIST, req);
    } catch (error) {
      this.logger.error(new EmitEventError(`Error emitting event to BULLMQ: ${BULLMQ_QUEUE.PERSIST_THREAD}`, error));
    }

    try {
      if (mode === GatewayMode.VECTORIZE) await this.vectorizeQueue.add(BULLMQ_JOB.VECTORIZE, req);
    } catch (error) {
      this.logger.error(new EmitEventError(`Error emitting event to BULLMQ: ${BULLMQ_QUEUE.VECTORIZE_THREAD}`, error));
    }
  }
}
