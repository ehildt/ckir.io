import { DefaultJobOptions } from 'bullmq';
import { RedisOptions } from 'ioredis';
import { ServerOptions } from 'socket.io';

export class ConfigFactoryValidationError extends Error {
  constructor(message?: string, cause?: unknown) {
    super(message, { cause });
    this.name = this.constructor.name;
  }
}

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

export type SocketIOConfig = {
  port: number;
  event: string;
  opts: Partial<ServerOptions>;
};

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
