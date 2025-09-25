import { BullMQConfig } from '@ckir.io/bullmq';
import { Injectable } from '@nestjs/common';
import Joi from 'joi';
import pino from 'pino';

import {
  AppConfigAdapter,
  AppConfigSchema,
  BullMQConfigAdapter,
  BullMQConfigArgsAdapter,
  BullMQConfigArgsSchema,
  BullMQConfigSchema,
  MongoConfigAdapter,
  MongoConfigSchema,
  PinoAdapter,
  PinoLoggerConfigSchema,
} from './config-factory.adapters';
import { AppConfig, BullMQArgs, ConfigFactoryValidationError, MongoConfig } from './config-factory.model';

@Injectable()
export class ConfigFactoryService {
  private _appConfig?: AppConfig;
  private _mongoConfig?: MongoConfig;
  private _bullMQConfig?: BullMQConfig;
  private _pinoConfig?: pino.LoggerOptions;

  get appConfig() {
    if (this._appConfig) return this._appConfig;
    const config = this.validate<AppConfig>(AppConfigAdapter(), AppConfigSchema, 'appConfig');
    return (this._appConfig = config);
  }

  get bullMQConfig() {
    if (this._bullMQConfig) return this._bullMQConfig;
    this.validate<BullMQArgs>(BullMQConfigArgsAdapter(), BullMQConfigArgsSchema, 'BullMQConfigArgs');
    const config = this.validate<BullMQConfig>(BullMQConfigAdapter(), BullMQConfigSchema, 'bullMQConfig');
    return (this._bullMQConfig = config);
  }

  get mongoConfig() {
    if (this._mongoConfig) return this._mongoConfig;
    const config = this.validate<MongoConfig>(MongoConfigAdapter(), MongoConfigSchema, 'mongoConfig');
    return (this._mongoConfig = config);
  }

  get pinoConfig() {
    if (this._pinoConfig) return this._pinoConfig;
    const config = this.validate<pino.LoggerOptions>(PinoAdapter(), PinoLoggerConfigSchema, '_pinoConfig');
    return (this._pinoConfig = config);
  }

  private validate<T>(payload: T, schema: Joi.ObjectSchema<T>, namespace?: string) {
    const result = schema.validate(payload, { abortEarly: false });
    if (!result.error) return payload;
    throw new ConfigFactoryValidationError(`${namespace} schema violation`, result.error.details);
  }
}
