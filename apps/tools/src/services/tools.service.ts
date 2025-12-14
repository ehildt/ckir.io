import {
  BULLMQ_JOB,
  BULLMQ_QUEUE,
  BullMQPinoLoggerService,
} from '@ehildt/ckir-bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

import { FastifyMultipartDataWithFilters } from '@/helpers/get-fastify-multipart-data.helper';

@Injectable()
export class ToolsService {
  constructor(
    private readonly logger: BullMQPinoLoggerService,
    @InjectQueue(BULLMQ_QUEUE.BROADCAST_TOOL)
    private readonly chatQueue: Queue,
  ) {}

  async emit(req: FastifyMultipartDataWithFilters) {
    if (req.filters.task === 'tool') {
      const job = await this.chatQueue.add(BULLMQ_JOB.DISPATCH, req);
      await this.logger.log(job);
      return job;
    }
  }
}
