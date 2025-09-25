import { TopicsReq } from '@ckir.io/dtos';
import { SocketIOService } from '@ckir.io/socket-io';
import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Queue } from 'bullmq';

import { BULLMQ_JOB, BULLMQ_QUEUE } from '@/constants/bullmq.constants';
import { SOCKET_IO_EVENT } from '@/constants/socket-io.constants';
import { TopicsMode } from '@/constants/topics-mode.constants';
import { EmitEventError } from '@/errors/emit-event.error';

@Injectable()
export class TopicsService implements OnModuleInit {
  constructor(
    private readonly logger: Logger,
    private readonly io: SocketIOService,
    @InjectQueue(BULLMQ_QUEUE.PERSIST_TOPIC)
    private readonly persistQueue: Queue,
    @InjectQueue(BULLMQ_QUEUE.VECTORIZE_TOPIC)
    private readonly vectorizeQueue: Queue,
    @InjectQueue(BULLMQ_QUEUE.BROADCAST_TOPIC)
    private readonly broadcastQueue: Queue,
  ) {}

  async onModuleInit() {
    this.io.on<TopicsReq>(SOCKET_IO_EVENT.TOPIC, async ({ data }) => await this.emit(data));
  }

  async emit(req: TopicsReq, mode?: TopicsMode) {
    try {
      await this.broadcastQueue.add(BULLMQ_JOB.DISPATCH, req);
    } catch (error) {
      this.logger.error(new EmitEventError(`Error emitting event to BULLMQ: ${BULLMQ_QUEUE.BROADCAST_TOPIC}`, error));
    }

    try {
      if (mode === TopicsMode.PERSIST) await this.persistQueue.add(BULLMQ_JOB.PERSIST, req);
    } catch (error) {
      this.logger.error(new EmitEventError(`Error emitting event to BULLMQ: ${BULLMQ_QUEUE.PERSIST_TOPIC}`, error));
    }

    try {
      if (mode === TopicsMode.VECTORIZE) await this.vectorizeQueue.add(BULLMQ_JOB.VECTORIZE, req);
    } catch (error) {
      this.logger.error(new EmitEventError(`Error emitting event to BULLMQ: ${BULLMQ_QUEUE.VECTORIZE_TOPIC}`, error));
    }
  }
}
