import { BullMQLoggerService } from '@ckir.io/bullmq';
import { PostsReq } from '@ckir.io/dtos';
import { textToLines } from '@ckir.io/helpers';
import { OllamaService } from '@ckir.io/ollama';
import { QdrantService } from '@ckir.io/qdrant';
import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

import { ConfigFactoryService } from '@/config-factory/config-factory.service';
import { BULLMQ_JOB, BULLMQ_QUEUE } from '@/constants/bullmq.constants';

@Processor(BULLMQ_QUEUE.VECTORIZE_POSTS)
export class PostsProcessor extends WorkerHost {
  constructor(
    private readonly qdrant: QdrantService,
    private readonly ollamaService: OllamaService,
    private readonly factory: ConfigFactoryService,
    private readonly bullMQLogger: BullMQLoggerService,
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
        this.factory.ollamaConfig.collection,
        await this.generateEmbeddings(job),
        { id: await response.text(), type: 'post' },
      );
  }

  private async generateEmbeddings(job: Job<PostsReq>) {
    const { text, flags, attachments } = job.data;
    const inputs: Array<string> = textToLines(text);
    if (inputs?.length > 1) inputs.push(text.trim());
    if (attachments?.length) inputs.push(attachments?.map(({ filename }) => filename)?.join(' '));
    if (flags?.length) inputs.push(flags?.map(({ label }) => label)?.join(' '));
    return this.ollamaService.embed({
      input: inputs,
      keep_alive: this.factory.ollamaConfig.keepAlive,
      model: this.factory.ollamaConfig.textEmbeddingModel,
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
