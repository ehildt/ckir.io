import { MongooseModuleFactoryOptions } from '@nestjs/mongoose';

export class ConfigFactoryValidationError extends Error {
  constructor(message?: string, cause?: unknown) {
    super(message, { cause });
    this.name = this.constructor.name;
  }
}

export type BullMQArgs = {
  jobPersist?: string;
  queuePersistPosts?: string;
  queuePersistTopics?: string;
  queuePersistThreads?: string;
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
