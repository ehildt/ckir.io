import {
  BULLMQ_JOB,
  BULLMQ_QUEUE,
  BullMQPinoLoggerService,
} from '@ehildt/ckir-bullmq';
import { OllamaService } from '@ehildt/ckir-ollama';
import { SocketIOService } from '@ehildt/ckir-socket-io';
import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

import { OllamaConfigService } from '@/configs/ollama-config.service';
import { FastifyMultipartDataWithFilters } from '@/helpers/get-fastify-multipart-data.helper';

@Processor(BULLMQ_QUEUE.IMAGE_COMPARE)
export class VisionsCompareProcessor extends WorkerHost {
  constructor(
    private readonly io: SocketIOService,
    private readonly ollamaService: OllamaService,
    private readonly ollamaConfigService: OllamaConfigService,
    private readonly bullMQLogger: BullMQPinoLoggerService,
  ) {
    super();
  }

  async process(job: Job<FastifyMultipartDataWithFilters>) {
    if (job.name !== BULLMQ_JOB.COMPARE_IMAGES) return;
    if (!Array.isArray(job.data.meta) || !job.data.meta.length) return;
    if (!Array.isArray(job.data.buffers) || !job.data.buffers.length) return;
    if (job.data.buffers.length < 2) return;
    if (job.data.buffers.length !== job.data.meta.length) return;

    const { buffers, meta, filters } = job.data;
    const images = meta.map(({ filename }) => filename).join(', ');
    const mimes = meta.map(({ mimetype }) => mimetype).join(', ');
    const messages = [
      {
        role: 'system',
        content: [
          'You are a careful vision evaluator.',
          'Compare all provided images in this single turn.',
          'Be factual; do not guess.',
          'For every claim, state the image’s filename and MIME type',
        ].join('\n'),
      },
      {
        role: 'user',
        content: [`images: ${images}`, `mimes: ${mimes}`].join('\n'),
        images: buffers,
      },
    ];

    if (filters.prompt)
      messages.push({
        role: 'user',
        content: filters.prompt,
      });

    const replies = await this.ollamaService.chat({
      messages,
      stream: false,
      model: filters.llm,
      keep_alive: this.ollamaConfigService.xOllamaConfig.keepAlive,
    });

    this.io.emit(job.data.filters.event, replies);
  }
  @OnWorkerEvent('completed')
  async onCompleted(job: Job) {
    await this.bullMQLogger.log(job);
  }

  @OnWorkerEvent('failed')
  async onFailed(job: Job) {
    await this.bullMQLogger.error(job);
  }
}
