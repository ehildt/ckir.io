import { XOllamaConfig } from './ollama.model';

export function OllamaXConfigAdapter(
  config: XOllamaConfig = {} as XOllamaConfig,
): XOllamaConfig {
  const { x_custom_options = {}, ...rest } = config;
  return {
    keepAlive: process.env.OLLAMA_KEEP_ALIVE,
    host: process.env.OLLAMA_HOST,
    ...rest,
    x_custom_options: {
      inferenceModel: process.env.OLLAMA_X_INFERENCE_MODEL,
      textEmbeddingModel: process.env.OLLAMA_X_TEXT_EMBEDDING_MODEL,
      visionModel: process.env.OLLAMA_X_VISION_MODEL,
      ...x_custom_options,
    },
  };
}
