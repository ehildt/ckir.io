import { CacheReturnValue } from '@ckir.io/decorators';
import {
  OllamaXConfigAdapter,
  OllamaXCustomConfigSchema,
} from '@ckir.io/ollama';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OllamaConfigService {
  @CacheReturnValue(OllamaXCustomConfigSchema)
  get ollamaConfig() {
    return OllamaXConfigAdapter();
  }
}
