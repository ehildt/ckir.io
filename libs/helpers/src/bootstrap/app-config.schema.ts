import Joi from 'joi';

import { AppConfig } from './app-config.model';
const ALLOWED_IP_VERSIONS = { version: ['ipv4', 'ipv6'] };

export const AppConfigSchema = Joi.object<AppConfig>({
  printConfig: Joi.boolean().required(),
  enableSwagger: Joi.boolean().required(),
  bodyLimit: Joi.number().min(1).required(),
  address: Joi.string().ip(ALLOWED_IP_VERSIONS).required(),
  port: Joi.number().integer().min(1).max(65535).required(),
  nodeEnv: Joi.string()
    .valid('development', 'production', 'test', 'local')
    .required(),
  cors: Joi.object({
    origin: Joi.string().optional(),
    methods: Joi.string().optional(),
    preflightContinue: Joi.boolean().optional(),
    optionsSuccessStatus: Joi.number().optional(),
    credentials: Joi.boolean().optional(),
    allowedHeaders: Joi.string().allow(null).optional(),
  }).optional(),
});
