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

export type OllamaConfig = {
  host: string;
  keepAlive: string;
  visionModel?: string;
  inferenceModel?: string;
  textEmbeddingModel?: string;
};
