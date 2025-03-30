import Joi from 'joi';

import { CONFIG_YML } from '@/configs/config-yml/loader';

export const APP_SCHEMA = {
  PORT: CONFIG_YML?.appConfig?.port ? Joi.number().default(CONFIG_YML.appConfig.port) : Joi.number().required(),

  ADDRESS: CONFIG_YML?.appConfig?.address
    ? Joi.string().default(CONFIG_YML.appConfig.address)
    : Joi.string().required(),

  PRINT_CONFIG:
    CONFIG_YML?.appConfig?.printConfig !== undefined
      ? Joi.boolean().default(CONFIG_YML.appConfig.printConfig)
      : Joi.boolean().required(),

  ENABLE_SWAGGER:
    CONFIG_YML?.appConfig?.enableSwagger !== undefined
      ? Joi.boolean().default(CONFIG_YML.appConfig.enableSwagger)
      : Joi.boolean().required(),

  NODE_ENV: CONFIG_YML?.appConfig?.nodeEnv
    ? Joi.string().default(CONFIG_YML.appConfig.nodeEnv)
    : Joi.string().required(),

  BODY_LIMIT: CONFIG_YML?.appConfig.bodyLimit
    ? Joi.number().default(CONFIG_YML.appConfig.bodyLimit)
    : Joi.number().required(),
};
