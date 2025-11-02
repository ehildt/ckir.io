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
export class VisionsService {
  constructor(
    private readonly logger: BullMQPinoLoggerService,
    @InjectQueue(BULLMQ_QUEUE.VISIONS_DESCRIBE)
    private readonly describeQueue: Queue,
    @InjectQueue(BULLMQ_QUEUE.VISIONS_COMPARE)
    private readonly compareQueue: Queue,
    @InjectQueue(BULLMQ_QUEUE.VISIONS_OCR)
    private readonly ocrQueue: Queue,
  ) {}

  async emit(req: FastifyMultipartDataWithFilters) {
    if (req.filters.mode === 'describe') {
      (
        await this.describeQueue.addBulk(
          req.buffers.map((buffer, i) => ({
            name: BULLMQ_JOB.VISIONS,
            data: {
              buffers: [buffer],
              meta: [req.meta[i]],
              filters: req.filters,
            },
          })),
        )
      )?.forEach((j) => this.logger.log(j));
    }

    if (req.filters.mode === 'compare') {
      const job = await this.compareQueue.add(BULLMQ_JOB.VISIONS, req);
      await this.logger.log(job);
    }

    if (req.filters.mode === 'ocr') {
      const job = await this.ocrQueue.add(BULLMQ_JOB.VISIONS, req);
      await this.logger.log(job);
    }
  }
}
