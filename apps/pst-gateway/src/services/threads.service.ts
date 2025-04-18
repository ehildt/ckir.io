import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { Queue } from 'bullmq';

import { BULLMQ_JOB, BULLMQ_QUEUE } from '@/constants/bullmq.constants';
import { GatewayMode } from '@/constants/gateway-mode.constants';
import { ThreadReq } from '@/dtos/thread-req.dto';
import { ThreadFilter, ThreadRepository } from '@/mongo/repositories/thread.repository';

@Injectable()
export class ThreadsService {
  constructor(
    private readonly threadRepository: ThreadRepository,
    @InjectQueue(BULLMQ_QUEUE.PERSIST_THREAD) private readonly pstThrQueue: Queue,
  ) {}

  async insertOneQueued(req: ThreadReq, mode: GatewayMode) {
    if (mode !== GatewayMode.PERSIST) throw new UnprocessableEntityException();
    await this.pstThrQueue.add(BULLMQ_JOB.PERSIST, req);
  }

  async threads(topicId: string, filter?: ThreadFilter) {
    return this.threadRepository.findAll(topicId, filter);
  }
}
