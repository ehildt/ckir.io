import {
  BULLMQ_JOB,
  BULLMQ_QUEUE,
  BullMQPinoLoggerService,
} from '@ehildt/ckir-bullmq';
import { OllamaService } from '@ehildt/ckir-ollama';
import { SOCKET_IO_EVENT, SocketIOService } from '@ehildt/ckir-socket-io';
import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { ChatResponse } from 'ollama';

import { OllamaConfigService } from '@/configs/ollama-config.service';
import { FastifyMultipartDataWithFilters } from '@/helpers/get-fastify-multipart-data.helper';

@Processor(BULLMQ_QUEUE.IMAGE_DESCRIBE)
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
    if (job.name !== BULLMQ_JOB.DESCRIBE_IMAGE)
      throw new Error('Unexpected job name');
    if (!job.data.filters.room) throw new Error('Missing room');
    if (!Array.isArray(job.data.meta) || !job.data.meta.length)
      throw new Error('Missing meta');
    if (!Array.isArray(job.data.buffers) || !job.data.buffers.length)
      throw new Error('Missing buffers');
    if (job.data.buffers.length !== job.data.meta.length)
      throw new Error('buffers/meta length mismatch');
    await this.handleJob(job);
  }

  @OnWorkerEvent('completed')
  async onCompleted(job: Job) {
    await this.bullMQLogger.log(job);
  }

  @OnWorkerEvent('error')
  async onError(job: Job) {
    await this.bullMQLogger.log(job);
  }

  @OnWorkerEvent('active')
  async onActive(job: Job) {
    await this.bullMQLogger.log(job);
  }

  @OnWorkerEvent('failed')
  async onFailed(job: Job) {
    await this.bullMQLogger.error(job);
  }

  private async handleJob(job: Job<FastifyMultipartDataWithFilters>) {
    const { buffers, meta, filters } = job.data;
    await Promise.allSettled(
      buffers.map(async (buffer, index) => {
        const { name } = meta[index];
        const messages = [
          {
            role: 'system',
            content: [
              'You are a vision-to-text model.',
              'Provide a detailed, factual description of the image.',
              'Focus only on observable details and avoid speculation.',
              'Unless the user specifies otherwise,',
              'present the response as a single plain-text block with no formatting.',
            ].join('\n'),
          },
          {
            role: 'user',
            images: [buffer],
            content: filters.prompt
              ? [filters.prompt, `Here is the file: ${name}`].join('\n')
              : `here is the file: ${name}`,
          },
        ];

        await this.ollamaService.chat(
          {
            messages,
            stream: filters.stream,
            model: filters.llm,
            keep_alive: this.ollamaConfigService.xOllamaConfig.keepAlive,
          },
          async (cres: ChatResponse) => {
            this.io.emitTo(SOCKET_IO_EVENT.VISION, filters.room, {
              meta: meta[index],
              task: filters.task,
              ...cres,
            });
          },
        );
      }),
    );
  }
}
