import {
  BULLMQ_JOB,
  BULLMQ_QUEUE,
  BullMQPinoLoggerService,
} from '@ehildt/ckir-bullmq';
import { ProcessingMode, TopicsReq } from '@ehildt/ckir-dtos';
import { SOCKET_IO_EVENT, SocketIOService } from '@ehildt/ckir-socket-io';
import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Queue } from 'bullmq';

@Injectable()
export class TopicsService implements OnModuleInit {
  constructor(
    private readonly logger: BullMQPinoLoggerService,
    private readonly io: SocketIOService,
    @InjectQueue(BULLMQ_QUEUE.PERSIST_TOPIC)
    private readonly persistQueue: Queue,
    @InjectQueue(BULLMQ_QUEUE.VECTORIZE_TOPIC)
    private readonly vectorizeQueue: Queue,
    @InjectQueue(BULLMQ_QUEUE.BROADCAST_TOPIC)
    private readonly broadcastQueue: Queue,
  ) {}

  async onModuleInit() {
    this.io.on<TopicsReq>(
      SOCKET_IO_EVENT.TOPIC,
      async ({ data }) => await this.emit(data),
    );
  }

  async emit(req: TopicsReq, mode?: ProcessingMode) {
    const job = await this.broadcastQueue.add(BULLMQ_JOB.DISPATCH, req);
    await this.logger.log(job);

    if (mode === ProcessingMode.PERSIST) {
      const job = await this.persistQueue.add(BULLMQ_JOB.PERSIST, req);
      await this.logger.log(job);
    }

    if (mode === ProcessingMode.VECTORIZE) {
      const job = await this.vectorizeQueue.add(BULLMQ_JOB.VECTORIZE, req);
      await this.logger.log(job);
    }
  }
}
