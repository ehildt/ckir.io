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

@Processor(BULLMQ_QUEUE.VISIONS_DESCRIBE)
export class VisionsDescribeProcessor extends WorkerHost {
  constructor(
    private readonly io: SocketIOService,
    private readonly ollamaService: OllamaService,
    private readonly ollamaConfigService: OllamaConfigService,
    private readonly bullMQLogger: BullMQPinoLoggerService,
  ) {
    super();
  }

  async process(job: Job<FastifyMultipartDataWithFilters>) {
    if (job.name !== BULLMQ_JOB.VISIONS) return;
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
            content:
              'You are a vision-to-text model. Provide a detailed, factual description of the image.',
          },
          {
            role: 'user',
            content: `file: ${filename} | mimetype: ${mimetype}`,
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
          keep_alive: this.ollamaConfigService.xOllamaConfig.keepAlive,
          model: this.ollamaConfigService.xOllamaConfig.x_options.visionModel,
        });
      }),
    );

    this.io.emit(job.data.filters.uuid, replies);
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
