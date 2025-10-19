import { getBooleanEnv } from '@ehildt/ckir-helpers';

import { XOllamaConfig } from './ollama.model';

export function XOllamaConfigAdapter(
  config: XOllamaConfig = {} as XOllamaConfig,
): XOllamaConfig {
  const { x_options = {}, ...rest } = config;
  return {
    keepAlive: process.env.OLLAMA_KEEP_ALIVE,
    host: process.env.OLLAMA_HOST,
    stream: getBooleanEnv(process.env.OLLAMA_X_STREAM, false),
    ...rest,
    x_options: {
      inferenceModel: process.env.OLLAMA_X_INFERENCE_MODEL,
      textEmbeddingModel: process.env.OLLAMA_X_TEXT_EMBEDDING_MODEL,
      visionModel: process.env.OLLAMA_X_VISION_MODEL,
      ...x_options,
    },
  };
}
