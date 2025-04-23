import { MongooseModuleFactoryOptions } from '@nestjs/mongoose';
import { DefaultJobOptions } from 'bullmq';
import { RedisOptions } from 'ioredis';

export class ConfigFactoryValidationError extends Error {
  constructor(message?: string, cause?: unknown) {
    super(message, { cause });
    this.name = this.constructor.name;
  }
}

export type IORedisConfig = RedisOptions;

export type BullMQArgs = {
  jobPersist?: string;
  queuePersistMessage?: string;
  queuePersistTopic?: string;
  queuePersistThread?: string;
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
  cors?: {
    origin?: string;
    methods?: string;
    preflightContinue?: boolean;
    optionsSuccessStatus?: number;
    credentials?: boolean;
    allowedHeaders?: string;
  };
};
