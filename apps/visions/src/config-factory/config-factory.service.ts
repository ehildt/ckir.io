import { BullMQArgs, BullMQConfig } from '@ckir.io/bullmq';
import { OllamaConfig } from '@ckir.io/ollama';
import { Injectable } from '@nestjs/common';
import { QdrantClientParams } from '@qdrant/js-client-rest';
import Joi from 'joi';
import pino from 'pino';

import {
  AppConfigAdapter,
  AppConfigSchema,
  BullMQConfigAdapter,
  BullMQConfigArgsAdapter,
  BullMQConfigArgsSchema,
  BullMQConfigSchema,
  PinoAdapter,
  PinoLoggerConfigSchema,
} from './config-factory.adapters';
import { AppConfig } from './config-factory.model';

@Injectable()
export class ConfigFactoryService {
  private _appConfig?: AppConfig;
  private _bullMQConfig?: BullMQConfig;
  private _pinoConfig?: pino.LoggerOptions;
  private _qdrantConfig?: QdrantClientParams;
  private _ollamaConfig?: OllamaConfig;

  get appConfig() {
    if (this._appConfig) return this._appConfig;
    const config = this.validate<AppConfig>(
      AppConfigAdapter(),
      AppConfigSchema,
      'appConfig',
    );
    return (this._appConfig = config);
  }

  get bullMQConfig() {
    if (this._bullMQConfig) return this._bullMQConfig;
    this.validate<BullMQArgs>(
      BullMQConfigArgsAdapter(),
      BullMQConfigArgsSchema,
      'BullMQConfigArgs',
    );
    const config = this.validate<BullMQConfig>(
      BullMQConfigAdapter(),
      BullMQConfigSchema,
      'bullMQConfig',
    );
    return (this._bullMQConfig = config);
  }

  get pinoConfig() {
    if (this._pinoConfig) return this._pinoConfig;
    const config = this.validate<pino.LoggerOptions>(
      PinoAdapter(),
      PinoLoggerConfigSchema,
      '_pinoConfig',
    );
    return (this._pinoConfig = config);
  }

  get qdrantConfig(): QdrantClientParams {
    // TODO: put into config service
    if (this._qdrantConfig) return this._qdrantConfig;
    return (this._qdrantConfig = {
      url: 'http://qdrant:6333',
      apiKey: 'e4f2c7d19a4b3f1285e7c93d6ac8f01a',
      checkCompatibility: false,
    });
  }

  get ollamaConfig(): OllamaConfig {
    // TODO: put into config service
    if (this._ollamaConfig) return this._ollamaConfig;
    return (this._ollamaConfig = {
      host: 'http://ollama:11434',
      visionModel: 'gpt-oss:20b',
      textEmbeddingModel: 'snowflake-arctic-embed2',
      keepAlive: '15m',
    });
  }

  private validate<T>(
    payload: T,
    schema: Joi.ObjectSchema<T>,
    namespace?: string,
  ) {
    const result = schema.validate(payload, { abortEarly: false });
    if (!result.error) return payload;
    // throw new ConfigFactoryValidationError(
    //   `${namespace} schema violation`,
    //   result.error.details,
    // );
  }
}
