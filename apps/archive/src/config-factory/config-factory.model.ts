import { MongooseModuleFactoryOptions } from '@nestjs/mongoose';
import { DefaultJobOptions } from 'bullmq';
import { RedisOptions } from 'ioredis';

export class ConfigFactoryValidationError extends Error {
  constructor(message?: string, cause?: unknown) {
    super(message, { cause });
    this.name = this.constructor.name;
  }
}

export type CONFIG_NAMESPACE = 'APP' | 'BULLMQ' | 'PUBSUB' | 'SOCKET_IO';
export type IORedisConfig = RedisOptions;

export type BullMQArgs = {
  jobPersist?: string;
  jobMessage?: string;
  jobVectorize?: string;
  queuePersist?: string;
  queueMessage?: string;
  queueVectorize?: string;
};

export type BullMQConfig = {
  defaultJobOptions?: DefaultJobOptions;
  connection?: IORedisConfig;
};

export type MongoConfig = MongooseModuleFactoryOptions;

export type AppConfig = {
  port: number;
  nodeEnv: string;
  address: string;
  printConfig: boolean;
  bodyLimit: number;
  enableSwagger: boolean;
  enableREST: boolean;
  cors?: {
    origin?: string;
    methods?: string;
    preflightContinue?: boolean;
    optionsSuccessStatus?: number;
    credentials?: boolean;
    allowedHeaders?: string;
  };
};
