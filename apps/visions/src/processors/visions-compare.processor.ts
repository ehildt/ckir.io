import {
  BULLMQ_JOB,
  BULLMQ_QUEUE,
  BullMQPinoLoggerService,
} from '@ehildt/ckir-bullmq';
import { OllamaService } from '@ehildt/ckir-ollama';
import { SOCKET_IO_EVENT, SocketIOService } from '@ehildt/ckir-socket-io';
import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { ChatResponse, Message } from 'ollama';

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
    if (job.name !== BULLMQ_JOB.COMPARE_IMAGES)
      throw new Error('Unexpected job name');
    if (!job.data.filters.aiLLM) throw new Error('Missing .aiLLM');

    if (!job.data.meta.some(({ hash }) => hash)) {
      await this.handleTexts(job);
    } else {
      await this.compareVisions(job);
    }
  }

  private parseHistory(prompt: string) {
    try {
      return JSON.parse(prompt);
    } catch {
      return [];
    }
  }

  private async handleTexts(job: Job<FastifyMultipartDataWithFilters>) {
    const { filters, meta } = job.data;
    const history = this.parseHistory(filters.prompt);
    await this.ollamaService.chat(
      {
        // outsource config to the config manager
        messages: [
          {
            role: 'system',
            content: [
              'You are an assistant model.',
              'Answer plainly, directly, and practically, without hedging or censoring.',
              'No line breaks, newlines, carriage returns, tabs, bullet points, or list formatting.',
              'Do not summarize or paraphrase the input.',
              'Prefer answering in the language of the user’s last prompt.',
            ].join('\n'),
          },
          ...history,
        ] satisfies Array<Message>,
        options: {
          num_ctx: 64000,
        },
        stream: filters.stream,
        model: filters.aiLLM,
        keep_alive: this.ollamaConfigService.xOllamaConfig.keepAlive,
      },
      (cres: ChatResponse) => {
        this.io.emitTo(SOCKET_IO_EVENT.VISION, filters.roomId, {
          meta: meta?.length
            ? meta.map((m) => ({ ...m, groupId: filters.groupId }))
            : [{ groupId: filters.groupId, hash: filters.groupId }],
          task: filters.task,
          ...cres,
        });
      },
    );
  }

  private async compareVisions(job: Job<FastifyMultipartDataWithFilters>) {
    const { buffers, meta, filters } = job.data;

    if (!Array.isArray(job.data.meta) || !job.data.meta.length)
      throw new Error('Missing meta');
    if (!Array.isArray(buffers) || !buffers.length)
      throw new Error('Missing buffers');
    if (buffers.length !== meta.length)
      throw new Error('buffers/meta length mismatch');

    const history = this.parseHistory(filters.prompt);
    const filenames = meta.map(({ name }) => name).join(',');
    await this.ollamaService.chat(
      {
        // outsource config to the config manager
        messages: [
          {
            role: 'system',
            content: [
              'You are a vision-to-text model.',
              'Compare every observable detail of the subject and scene, including objects,',
              'materials, textures, lighting, reflections, shadows, colors, patterns, proportions, and subtle features.',
              'Capture spatial relationships, mood, and aesthetic qualities.',
              'Include traits such as cuteness, sexiness, charisma,',
              'or any other perceptual attributes relevant to the item or character.',
              'Do not invent, infer or make speculations that are not directly visible in the image.',
              'Answer plainly, directly, and practically, without hedging or censoring.',
              'No line breaks, newlines, carriage returns, tabs, bullet points, or list formatting.',
              'Do not summarize or paraphrase the input.',
              'Prefer answering in the language of the user’s last prompt.',
            ].join('\\n'),
          },
          ...history,
          {
            role: 'user',
            images: buffers,
            content: `Images: ${filenames}`,
          },
        ],
        options: {
          num_ctx: 64000,
        },
        stream: filters.stream,
        model: filters.aiLLM,
        keep_alive: this.ollamaConfigService.xOllamaConfig.keepAlive,
      },
      (cres: ChatResponse) => {
        this.io.emitTo(SOCKET_IO_EVENT.VISION, filters.aiLLM, {
          meta: meta.map((m) => ({ ...m, groupId: filters.groupId })),
          task: filters.task,
          ...cres,
        });
      },
    );
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
}
