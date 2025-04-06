import { Injectable } from '@nestjs/common';
import Joi from 'joi';

import {
  AppConfigAdapter,
  AppConfigSchema,
  BullMQConfigAdapter,
  BullMQConfigArgsAdapter,
  BullMQConfigArgsSchema,
  BullMQConfigSchema,
  MongoConfigAdapter,
  MongoConfigSchema,
} from './config-factory.adapters';
import { AppConfig, BullMQArgs, BullMQConfig, ConfigFactoryValidationError, MongoConfig } from './config-factory.model';

@Injectable()
export class ConfigFactoryService {
  private _appConfig?: AppConfig;
  private _mongoConfig?: MongoConfig;
  private _bullMQConfig?: BullMQConfig;

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

  private validate<T>(payload: T, schema: Joi.ObjectSchema<T>, namespace?: string) {
    const result = schema.validate(payload, { abortEarly: false });
    if (!result.error) return payload;
    throw new ConfigFactoryValidationError(`${namespace} schema violation`, result.error.details);
  }
}
