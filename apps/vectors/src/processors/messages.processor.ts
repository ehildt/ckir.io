import { BullMQLoggerService } from '@ckir.io/bullmq';
import { MessageReq } from '@ckir.io/dtos';
import { OllamaService } from '@ckir.io/ollama';
import { QdrantService } from '@ckir.io/qdrant';
import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

import { ConfigFactoryService } from '@/config-factory/config-factory.service';
import { BULLMQ_JOB, BULLMQ_QUEUE } from '@/constants/bullmq.constants';
import { textToLines } from '@/helpers/text-to-lines.helper';

@Processor(BULLMQ_QUEUE.VECTORIZE_MESSAGE)
export class MessagesProcessor extends WorkerHost {
  constructor(
    private readonly qdrant: QdrantService,
    private readonly ollamaService: OllamaService,
    private readonly factory: ConfigFactoryService,
    private readonly bullMQLogger: BullMQLoggerService,
  ) {
    super();
  }

  async process(job: Job<MessageReq>) {
    if (job.name !== BULLMQ_JOB.VECTORIZE) return;
    if (!job.data.text?.length) return;

    const response = await fetch(`http://snaps:3003/api/v1/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(job.data),
    });

    if (response.ok)
      await this.qdrant.upsertBatch<{ messageId: string }>(
        this.factory.ollamaConfig.collection,
        await this.generateEmbeddings(job),
        { messageId: await response.text() },
      );
  }

  private async generateEmbeddings(job: Job<MessageReq>) {
    const { text, flags, attachments } = job.data;
    // ! text for contextual search
    const inputs: Array<string> = [text?.trim()];
    if (attachments?.length) inputs.push(attachments?.map(({ filename }) => filename)?.join(' '));
    if (flags?.length) inputs.push(flags?.map(({ label }) => label)?.join(' '));
    // ! lines for fine-grained searches
    if (text?.length) inputs.push(...textToLines(text));
    return await this.ollamaService.embed({
      input: inputs,
      keep_alive: this.factory.ollamaConfig.keepAlive,
      model: this.factory.ollamaConfig.textEmbeddingModel,
    });
  }

  @OnWorkerEvent('completed')
  async onCompleted(job: Job<MessageReq>) {
    await this.bullMQLogger.log(job);
  }

  @OnWorkerEvent('failed')
  async onFailed(job: Job<MessageReq>) {
    await this.bullMQLogger.error(job);
  }
}
