import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { Queue } from 'bullmq';

import { BULLMQ_JOB, BULLMQ_QUEUE } from '@/constants/bullmq.constants';
import { GatewayMode } from '@/constants/gateway-mode.constants';
import { TopicReq } from '@/dtos/topic-req.dto';

import { TopicFilter, TopicRepository } from '../mongo/repositories/topic.repository';

@Injectable()
export class TopicsService {
  constructor(
    private readonly topicRepository: TopicRepository,
    @InjectQueue(BULLMQ_QUEUE.PERSIST_TOPIC) private readonly pstTpcQueue: Queue,
  ) {}

  async insertOneQueued(req: TopicReq, mode: GatewayMode) {
    if (mode !== GatewayMode.PERSIST) throw new UnprocessableEntityException();
    await this.pstTpcQueue.add(BULLMQ_JOB.PERSIST, req);
  }

  async topics(filter?: TopicFilter) {
    return this.topicRepository.findAll(filter);
  }
}
