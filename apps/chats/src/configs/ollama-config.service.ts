import { CacheReturnValue } from '@ehildt/ckir-config-factory';
import { XOllamaConfigAdapter, XOllamaConfigSchema } from '@ehildt/ckir-ollama';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OllamaConfigService {
  @CacheReturnValue(XOllamaConfigSchema)
  get xOllamaConfig() {
    return XOllamaConfigAdapter();
  }
}
