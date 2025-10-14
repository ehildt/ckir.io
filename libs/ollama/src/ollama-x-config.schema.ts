import Joi from 'joi';

import { XOllamaConfig } from './ollama.model';

export const XOllamaConfigSchema = Joi.object<XOllamaConfig>({
  host: Joi.string().uri().required(),
  keepAlive: Joi.string().required(),
  stream: Joi.boolean().optional(),
  x_options: Joi.object({
    inferenceModel: Joi.string().optional(),
    textEmbeddingModel: Joi.string().optional(),
    visionModel: Joi.string().optional(),
  }).required(),
});
