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

@Processor(BULLMQ_QUEUE.IMAGE_OCR)
export class VisionsOCRProcessor extends WorkerHost {
  constructor(
    private readonly io: SocketIOService,
    private readonly ollamaService: OllamaService,
    private readonly ollamaConfigService: OllamaConfigService,
    private readonly bullMQLogger: BullMQPinoLoggerService,
  ) {
    super();
  }

  async process(job: Job<FastifyMultipartDataWithFilters>) {
    if (job.name !== BULLMQ_JOB.OCR_IMAGE) return;
    if (!Array.isArray(job.data.meta) || !job.data.meta.length) return;
    if (!Array.isArray(job.data.buffers) || !job.data.buffers.length) return;
    if (job.data.buffers.length !== job.data.meta.length) return;

    const { buffers, meta, filters } = job.data;
    const replies = await Promise.allSettled(
      buffers.map((buffer, index) => {
        const { filename, mimetype } = meta[index];
        const messages = [
          {
            role: 'system',
            content: [
              'You are an OCR engine.',
              'Extract all visible text exactly as written,',
              'preserving case, punctuation, emojis and spacing.',
              'Do not describe the image or add commentary.',
              'Output plain text only.',
            ].join('\n'),
          },
          {
            role: 'user',
            content: `file: ${filename}, MIME type: ${mimetype}`,
            images: [buffer],
          },
        ];

        if (filters.prompt)
          messages.push({
            role: 'user',
            content: filters.prompt,
          });

        return this.ollamaService.chat({
          messages,
          stream: false,
          model: filters.llm,
          keep_alive: this.ollamaConfigService.xOllamaConfig.keepAlive,
        });
      }),
    );

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
