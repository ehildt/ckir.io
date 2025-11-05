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
    @InjectQueue(BULLMQ_QUEUE.IMAGE_DESCRIBE)
    private readonly describeQueue: Queue,
    @InjectQueue(BULLMQ_QUEUE.IMAGE_COMPARE)
    private readonly compareQueue: Queue,
    @InjectQueue(BULLMQ_QUEUE.IMAGE_OCR)
    private readonly ocrQueue: Queue,
  ) {}

  async emit(req: FastifyMultipartDataWithFilters) {
    if (req.filters.task === 'describe') {
      const job = await this.describeQueue.add(BULLMQ_JOB.DESCRIBE_IMAGE, req);
      await this.logger.log(job);
      return job;
    }

    if (req.filters.task === 'compare') {
      const job = await this.compareQueue.add(BULLMQ_JOB.COMPARE_IMAGES, req);
      await this.logger.log(job);
      return job;
    }

    if (req.filters.task === 'ocr') {
      const job = await this.ocrQueue.add(BULLMQ_JOB.OCR_IMAGE, req);
      await this.logger.log(job);
      return job;
    }
  }
}
