import {
  BULLMQ_JOB,
  BULLMQ_QUEUE,
  BullMQPinoLoggerService,
} from '@ehildt/ckir-bullmq';
import { PostsReq } from '@ehildt/ckir-dtos';
import { TextToLines } from '@ehildt/ckir-helpers';
import { OllamaService } from '@ehildt/ckir-ollama';
import { QdrantService } from '@ehildt/ckir-qdrant';
import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

import { OllamaConfigService } from '@/configs/ollama-config.service';

// ! feels like it does not belong to a standalone Vectorizer
@Processor(BULLMQ_QUEUE.VECTORIZE_POST)
export class PostsProcessor extends WorkerHost {
  constructor(
    private readonly qdrant: QdrantService,
    private readonly ollamaService: OllamaService,
    private readonly ollamaConfigService: OllamaConfigService,
    private readonly bullMQLogger: BullMQPinoLoggerService,
  ) {
    super();
  }

  async process(job: Job<PostsReq>) {
    if (job.name !== BULLMQ_JOB.VECTORIZE) return;
    if (!job.data.text?.length) return;

    const response = await fetch(`http://snaps:3003/api/v1/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(job.data),
    });

    if (response.ok)
      await this.qdrant.upsertBatch<{ id: string; type: string }>(
        'ckir',
        await this.generateEmbeddings(job),
        {
          id: await response.text(),
          type: 'post',
        },
      );
  }

  private async generateEmbeddings(job: Job<PostsReq>) {
    const { text, flags, attachments } = job.data;
    const ttl = new TextToLines(text);
    if (ttl?.lines > 1) ttl.append(text);
    if (attachments?.length)
      ttl.append(attachments?.map(({ filename }) => filename)?.join(' '));
    if (flags?.length) ttl.append(flags?.map(({ label }) => label)?.join(' '));
    return this.ollamaService.embed({
      input: ttl.build(),
      keep_alive: this.ollamaConfigService.xOllamaConfig.keepAlive,
      model:
        this.ollamaConfigService.xOllamaConfig.x_options.textEmbeddingModel,
    });
  }

  @OnWorkerEvent('completed')
  async onCompleted(job: Job<PostsReq>) {
    await this.bullMQLogger.log(job);
  }

  @OnWorkerEvent('failed')
  async onFailed(job: Job<PostsReq>) {
    await this.bullMQLogger.error(job);
  }
}
