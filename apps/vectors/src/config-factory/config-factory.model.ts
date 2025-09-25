export class ConfigFactoryValidationError extends Error {
  constructor(message?: string, cause?: unknown) {
    super(message, { cause });
    this.name = this.constructor.name;
  }
}

export type BullMQArgs = {
  jobVectorize?: string;
  queuePersistMessage?: string;
  queuePersistTopic?: string;
  queuePersistThread?: string;
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

export type OllamaConfig = {
  collection: string;
  host: string;
  keepAlive: string;
  // ! FIX: to be removed and part of the request header
  inferenceModel: string;
  textEmbeddingModel: string;
};
