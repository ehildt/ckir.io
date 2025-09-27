import { BullMQLoggerService } from '@ckir.io/bullmq';
import { TopicsReq } from '@ckir.io/dtos';
import { textToLines } from '@ckir.io/helpers';
import { OllamaService } from '@ckir.io/ollama';
import { QdrantService } from '@ckir.io/qdrant';
import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

import { ConfigFactoryService } from '@/config-factory/config-factory.service';
import { BULLMQ_JOB, BULLMQ_QUEUE } from '@/constants/bullmq.constants';

@Processor(BULLMQ_QUEUE.VECTORIZE_TOPIC)
export class TopicsProcessor extends WorkerHost {
  constructor(
    private readonly qdrant: QdrantService,
    private readonly ollamaService: OllamaService,
    private readonly factory: ConfigFactoryService,
    private readonly bullMQLogger: BullMQLoggerService,
  ) {
    super();
  }

  async process(job: Job<TopicsReq>) {
    if (job.name !== BULLMQ_JOB.VECTORIZE) return;
    if (!job.data.title?.length) return;
    if (!job.data.description?.length) return;

    const response = await fetch(`http://snaps:3003/api/v1/topics`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(job.data),
    });

    if (response.ok)
      await this.qdrant.upsertBatch<{ id: string; type: string }>(
        this.factory.ollamaConfig.collection,
        await this.generateEmbeddings(job),
        { id: await response.text(), type: 'topic' },
      );
  }

  private async generateEmbeddings(job: Job<TopicsReq>) {
    const { description, tags } = job.data;
    const inputs: Array<string> = textToLines(description);
    if (inputs?.length > 1) inputs.push(description.trim());
    if (tags?.length) inputs.push(tags?.join(' '));
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
