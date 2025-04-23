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
  jobDispatch?: string;
  jobVectorize?: string;
  queuePersistMessage?: string;
  queueBroadcastMessage?: string;
  queueVectorizeMessage?: string;
  queuePersistTopic?: string;
  queueBroadcastTopic?: string;
  queueVectorizeTopic?: string;
  queuePersistThread?: string;
  queueBroadcastThread?: string;
  queueVectorizeThread?: string;
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
