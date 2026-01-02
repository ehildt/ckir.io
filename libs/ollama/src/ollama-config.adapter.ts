import { Config } from 'ollama';

export function OllamaConfigAdapter(config?: Config) {
  return {
    host: process.env.OLLAMA_HOST,
    ...config,
  };
}
