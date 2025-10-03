import { BULLMQ_JOB, BULLMQ_QUEUE } from '../bullmq/bullmq.constants';
import { BullMQArgs } from '../bullmq/bullmq.model';

export function BullMQArgsAdapter(): BullMQArgs {
  return {
    jobPersist: BULLMQ_JOB.PERSIST,
    jobVectorize: BULLMQ_JOB.VECTORIZE,
    jobDispatch: BULLMQ_JOB.DISPATCH,
    queuePersistTopic: BULLMQ_QUEUE.PERSIST_TOPIC,
    queueBroadcastTopic: BULLMQ_QUEUE.BROADCAST_TOPIC,
    queueVectorizeTopic: BULLMQ_QUEUE.VECTORIZE_TOPIC,
  };
}
