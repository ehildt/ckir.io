import {
  BULLMQ_JOB,
  BULLMQ_QUEUE,
  BullMQPinoLoggerService,
} from '@ehildt/ckir-bullmq';
import { OllamaService } from '@ehildt/ckir-ollama';
import { SOCKET_IO_EVENT, SocketIOService } from '@ehildt/ckir-socket-io';
import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { format } from 'date-fns';
import { Message } from 'ollama';

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

    if (job.data.filters.stream) await this.handleStream(job);
    else await this.handleBuffered(job);
  }

  @OnWorkerEvent('completed')
  async onCompleted(job: Job) {
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

  private async handleBuffered(job: Job<FastifyMultipartDataWithFilters>) {
    const { buffers, meta, filters } = job.data;
    const replies = await Promise.allSettled(
      buffers.map(async (buffer, index) => {
        const { filename, mimetype } = meta[index];
        const messages = [
          {
            role: 'system',
            content: [
              'You are a vision-to-text model.',
              'Provide a detailed, factual description of the image.',
            ].join('\n'),
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
          stream: filters.stream,
          model: filters.llm,
          keep_alive: this.ollamaConfigService.xOllamaConfig.keepAlive,
        });
      }),
    );

    this.io.emitTo(SOCKET_IO_EVENT.VISION, filters.room, replies);
  }

  private async handleStream(job: Job<FastifyMultipartDataWithFilters>) {
    const { buffers, meta, filters } = job.data;
    const hash = format(new Date(), 'EEEE, dd MMM yyyy HH:mm');
    const files = meta
      .map(({ filename, mimetype }) => `${filename} ${mimetype}`)
      .join(',');
    const messages = [
      {
        role: 'system',
        content: [
          'You are a vision-to-text model.',
          'Provide a detailed, factual description of the image.',
        ].join('\n'),
      },
      {
        role: 'user',
        content: `Here are the images to be described ${files}`,
        images: buffers,
      },
    ];

    if (filters.prompt)
      messages.push({
        role: 'user',
        content: filters.prompt,
      });

    await this.ollamaService.chat(
      {
        messages,
        stream: filters.stream,
        model: filters.llm,
        keep_alive: this.ollamaConfigService.xOllamaConfig.keepAlive,
      },
      async (value: Message) => {
        this.io.emitTo(SOCKET_IO_EVENT.VISION, filters.room, {
          value,
          hash,
          meta,
          jobId: job.id,
          pid: process.pid,
        });
      },
    );
  }
}
