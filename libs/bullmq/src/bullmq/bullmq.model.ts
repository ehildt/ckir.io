import { DefaultJobOptions } from 'bullmq';
import { RedisOptions } from 'ioredis';

export type BullMQConfig = {
  defaultJobOptions?: DefaultJobOptions;
  connection?: RedisOptions;
};

export type BullMQArgs = {
  jobPersist?: string;
  jobDispatch?: string;
  jobVectorize?: string;
  queuePersistPost?: string;
  queueBroadcastPost?: string;
  queueVectorizePost?: string;
  queuePersistTopic?: string;
  queueBroadcastTopic?: string;
  queueVectorizeTopic?: string;
  queuePersistThread?: string;
  queueBroadcastThread?: string;
  queueVectorizeThread?: string;
};
