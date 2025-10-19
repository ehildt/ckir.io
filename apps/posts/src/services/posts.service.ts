import {
  BULLMQ_JOB,
  BULLMQ_QUEUE,
  BullMQPinoLoggerService,
} from '@ehildt/ckir-bullmq';
import { PostsReq, ProcessingMode } from '@ehildt/ckir-dtos';
import { SOCKET_IO_EVENT, SocketIOService } from '@ehildt/ckir-socket-io';
import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Queue } from 'bullmq';

@Injectable()
export class PostsService implements OnModuleInit {
  constructor(
    private readonly logger: BullMQPinoLoggerService,
    private readonly io: SocketIOService,
    @InjectQueue(BULLMQ_QUEUE.PERSIST_POST)
    private readonly snapsQueue: Queue,
    @InjectQueue(BULLMQ_QUEUE.BROADCAST_POST)
    private readonly postsQueue: Queue,
    @InjectQueue(BULLMQ_QUEUE.VECTORIZE_POST)
    private readonly vectorsQueue: Queue,
  ) {}

  async onModuleInit() {
    this.io.on<PostsReq>(
      SOCKET_IO_EVENT.POST,
      async ({ data }) => await this.emit(data),
    );
  }

  async emit(req: PostsReq, mode?: ProcessingMode) {
    const job = await this.postsQueue.add(BULLMQ_JOB.DISPATCH, req);
    await this.logger.log(job);

    if (mode === ProcessingMode.PERSIST) {
      const job = await this.snapsQueue.add(BULLMQ_JOB.PERSIST, req);
      await this.logger.log(job);
    }

    if (mode === ProcessingMode.VECTORIZE) {
      const job = await this.vectorsQueue.add(BULLMQ_JOB.VECTORIZE, req);
      await this.logger.log(job);
    }
  }
}
