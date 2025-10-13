import { QdrantClientParams } from '@qdrant/js-client-rest';
import Joi from 'joi';

export const QdrantClientConfigSchema = Joi.object<QdrantClientParams>({
  port: Joi.number().integer().min(1).max(65535).optional(),
  apiKey: Joi.string().optional(),
  https: Joi.boolean().optional(),
  prefix: Joi.string().optional(),
  url: Joi.string().uri().optional(),
  host: Joi.string().hostname().optional(),
  timeout: Joi.number().integer().min(0).optional(),
  headers: Joi.object()
    .pattern(
      Joi.string(),
      Joi.alternatives(
        Joi.string(),
        Joi.number(),
        Joi.array().items(Joi.string()),
      ),
    )
    .optional(),
  maxConnections: Joi.number().integer().min(1).optional(),
  checkCompatibility: Joi.boolean().optional(),
});
