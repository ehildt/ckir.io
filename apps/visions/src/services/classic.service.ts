import { BULLMQ_JOB, BULLMQ_QUEUE } from '@ehildt/ckir-bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

import { FastifyMultipartDataWithFiltersReq } from '@/dtos/classic/get-fastify-multipart-data-req.dto';

@Injectable()
export class ClassicService {
  constructor(
    @InjectQueue(BULLMQ_QUEUE.IMAGE_DESCRIBE)
    private readonly describeQueue: Queue,
    @InjectQueue(BULLMQ_QUEUE.IMAGE_COMPARE)
    private readonly compareQueue: Queue,
    @InjectQueue(BULLMQ_QUEUE.IMAGE_OCR)
    private readonly ocrQueue: Queue,
  ) {}

  async emit(req: FastifyMultipartDataWithFiltersReq) {
    if (req.filters.task === 'describe')
      return this.describeQueue.add(BULLMQ_JOB.DESCRIBE_IMAGE, req);

    if (req.filters.task === 'compare')
      return this.compareQueue.add(BULLMQ_JOB.COMPARE_IMAGES, req);

    if (req.filters.task === 'ocr')
      return this.ocrQueue.add(BULLMQ_JOB.OCR_IMAGE, req);
  }
}
