import { CacheReturnValue } from '@ckir.io/decorators';
import { XOllamaConfigAdapter, XOllamaConfigSchema } from '@ckir.io/ollama';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OllamaConfigService {
  @CacheReturnValue(XOllamaConfigSchema)
  get xOllamaConfig() {
    return XOllamaConfigAdapter();
  }
}
