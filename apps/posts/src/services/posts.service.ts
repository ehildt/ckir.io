import { PostsReq } from '@ckir.io/dtos';
import { SocketIOService } from '@ckir.io/socket-io';
import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Queue } from 'bullmq';

import { PostsMode } from '../constants/posts-mode.constants';

import { BULLMQ_JOB, BULLMQ_QUEUE } from '@/constants/bullmq.constants';
import { SOCKET_IO_EVENT } from '@/constants/socket-io.constants';
import { EmitEventError } from '@/errors/emit-event.error';

@Injectable()
export class PostsService implements OnModuleInit {
  constructor(
    private readonly logger: Logger,
    private readonly io: SocketIOService,
    @InjectQueue(BULLMQ_QUEUE.PERSIST_POSTS)
    private readonly snapsQueue: Queue,
    @InjectQueue(BULLMQ_QUEUE.BROADCAST_POSTS)
    private readonly postsQueue: Queue,
    @InjectQueue(BULLMQ_QUEUE.VECTORIZE_POSTS)
    private readonly vectorsQueue: Queue,
  ) {}

  async onModuleInit() {
    this.io.on<PostsReq>(SOCKET_IO_EVENT.POST, async ({ data }) => await this.emit(data));
  }

  async emit(req: PostsReq, mode?: PostsMode) {
    try {
      await this.postsQueue.add(BULLMQ_JOB.DISPATCH, req);
    } catch (error) {
      this.logger.error(new EmitEventError(`Error emitting event to BULLMQ: ${BULLMQ_QUEUE.BROADCAST_POSTS}`, error));
    }

    try {
      if (mode === PostsMode.PERSIST) await this.snapsQueue.add(BULLMQ_JOB.PERSIST, req);
    } catch (error) {
      this.logger.error(new EmitEventError(`Error emitting event to BULLMQ: ${BULLMQ_QUEUE.PERSIST_POSTS}`, error));
    }

    try {
      if (mode === PostsMode.VECTORIZE) await this.vectorsQueue.add(BULLMQ_JOB.VECTORIZE, req);
    } catch (error) {
      this.logger.error(new EmitEventError(`Error emitting event to BULLMQ: ${BULLMQ_QUEUE.VECTORIZE_POSTS}`, error));
    }
  }
}
