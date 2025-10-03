import { DynamicModule, Module } from '@nestjs/common';
import { Ollama } from 'ollama';

import { OLLAMA_CLIENT } from './ollama.constants';
import { OllamaModuleProps } from './ollama.model';
import { OllamaService } from './ollama.service';

@Module({})
export class OllamaModule {
  static registerAsync(options: OllamaModuleProps): DynamicModule {
    return {
      global: options.global,
      module: OllamaModule,
      exports: [OLLAMA_CLIENT, OllamaService],
      providers: [
        OllamaService,
        {
          provide: OLLAMA_CLIENT,
          inject: options.inject,
          useFactory: async (...deps) =>
            new Ollama(await options.useFactory(...deps)),
        },
      ],
    };
  }
}
