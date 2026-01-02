import {
  BULLMQ_JOB,
  BULLMQ_QUEUE,
  BullMQPinoLoggerService,
} from '@ehildt/ckir-bullmq';
import { ThreadsReq } from '@ehildt/ckir-dtos';
import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

@Processor(BULLMQ_QUEUE.VECTORIZE_THREAD)
export class ThreadsVectorizeProcessor extends WorkerHost {
  constructor(private readonly bullMQLogger: BullMQPinoLoggerService) {
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
      await fetch(`http://vectors:3004/api/v1/<endpoint>`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: job.data, // ! convert data to text
          collection: 'ckir',
          payload: {
            id: await response.text(),
            type: 'thread',
          },
        }),
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
