import { DefaultJobOptions } from 'bullmq';
import { RedisOptions } from 'ioredis';

export type BullMQConfig = {
  defaultJobOptions?: DefaultJobOptions;
  connection?: RedisOptions;
};
