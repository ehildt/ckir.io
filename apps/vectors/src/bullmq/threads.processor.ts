import { OllamaService } from '@ckir.io/ollama';
import { QdrantService } from '@ckir.io/qdrant';
import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

import { BullMQLoggerService } from '@/bullmq-logger/bullmq-logger.service';
import { ConfigFactoryService } from '@/config-factory/config-factory.service';
import { BULLMQ_JOB, BULLMQ_QUEUE } from '@/constants/bullmq.constants';
import { ThreadReq } from '@/dtos/thread-req.dto';
import { textToLines } from '@/helpers/text-to-lines.helper';

@Processor(BULLMQ_QUEUE.VECTORIZE_THREAD)
export class ThreadsProcessor extends WorkerHost {
  constructor(
    private readonly qdrant: QdrantService,
    private readonly ollamaService: OllamaService,
    private readonly factory: ConfigFactoryService,
    private readonly bullMQLogger: BullMQLoggerService,
  ) {
    super();
  }

  async process(job: Job<ThreadReq>) {
    if (job.name !== BULLMQ_JOB.VECTORIZE) return;
    if (!job.data.description?.length) return;

    const response = await fetch(`http://snaps:3003/api/v1/threads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(job.data),
    });

    if (response.ok)
      await this.qdrant.upsertBatch<{ threadId: string }>(
        this.factory.ollamaConfig.collection,
        await this.generateEmbeddings(job),
        { threadId: await response.text() },
      );
  }

  private async generateEmbeddings(job: Job<ThreadReq>) {
    const { description, tags } = job.data;
    const inputs: Array<string> = [];
    if (tags?.length) inputs.push(tags?.join(' '));
    if (description?.length) inputs.push(...textToLines(description));
    return await this.ollamaService.embed({
      input: inputs,
      keep_alive: this.factory.ollamaConfig.keepAlive,
      model: this.factory.ollamaConfig.textEmbeddingModel,
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
