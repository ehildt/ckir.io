import { Config, GenerateRequest } from 'ollama';

export type OllamaGenerateRequest = GenerateRequest & {
  stream: true;
};

export type OllamaConfigFactory = (...deps: any[]) => Promise<Config>;

export type OllamaModuleProps = {
  global?: boolean;
  inject: Array<any>;
  useFactory: OllamaConfigFactory;
};

export type XOllamaConfig = {
  host: string;
  keepAlive: string;
  stream?: boolean;
  x_options: XOllamaOptions;
};

export type XOllamaOptions = {
  inferenceModel?: string;
  textEmbeddingModel?: string;
  visionModel?: string;
};

export type { EmbedResponse } from 'ollama';
