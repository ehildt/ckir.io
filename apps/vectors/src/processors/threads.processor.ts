import {
  BULLMQ_JOB,
  BULLMQ_QUEUE,
  BullMQPinoLoggerService,
} from '@ehildt/ckir-bullmq';
import { ThreadsReq } from '@ehildt/ckir-dtos';
import { TextToLines } from '@ehildt/ckir-helpers';
import { OllamaService } from '@ehildt/ckir-ollama';
import { QdrantService } from '@ehildt/ckir-qdrant';
import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

import { OllamaConfigService } from '@/configs/ollama-config.service';

// ! feels like it does not belong to a standalone Vectorizer
@Processor(BULLMQ_QUEUE.VECTORIZE_THREAD)
export class ThreadsProcessor extends WorkerHost {
  constructor(
    private readonly qdrant: QdrantService,
    private readonly ollamaService: OllamaService,
    private readonly ollamaConfigService: OllamaConfigService,
    private readonly bullMQLogger: BullMQPinoLoggerService,
  ) {
    super();
  }

  async process(job: Job<ThreadsReq>) {
    if (job.name !== BULLMQ_JOB.VECTORIZE) return;
    if (!job.data.description?.length) return;

    const response = await fetch(`http://snaps:3003/api/v1/threads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(job.data),
    });

    if (response.ok)
      await this.qdrant.upsertBatch<{ id: string; type: string }>(
        'ckir', // ! have this in the headers?
        await this.generateEmbeddings(job),
        { id: await response.text(), type: 'thread' },
      );
  }

  private async generateEmbeddings(job: Job<ThreadsReq>) {
    const { description, tags } = job.data;
    const ttl = new TextToLines(description);
    if (ttl?.lines > 1) ttl.append(description);
    if (tags?.length) ttl.append(tags?.join(' '));
    return await this.ollamaService.embed({
      input: ttl.build(),
      keep_alive: this.ollamaConfigService.xOllamaConfig.keepAlive,
      model:
        this.ollamaConfigService.xOllamaConfig.x_options.textEmbeddingModel,
    });
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
