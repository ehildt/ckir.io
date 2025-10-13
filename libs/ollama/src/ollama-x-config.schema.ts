import Joi from 'joi';

import { XOllamaConfig } from './ollama.model';

export const OllamaXCustomConfigSchema = Joi.object<XOllamaConfig>({
  host: Joi.string().uri().required(),
  keepAlive: Joi.string().required(),
  x_custom_options: Joi.object({
    inferenceModel: Joi.string().optional(),
    textEmbeddingModel: Joi.string().optional(),
    visionModel: Joi.string().optional(),
  }).required(),
});
