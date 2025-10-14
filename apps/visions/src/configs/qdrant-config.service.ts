import { CacheReturnValue } from '@ckir.io/decorators';
import { QdrantClientConfigSchema, QdrantConfigAdapter } from '@ckir.io/qdrant';
import { Injectable } from '@nestjs/common';

@Injectable()
export class QdrantConfigService {
  @CacheReturnValue(QdrantClientConfigSchema)
  get qdrantConfig() {
    return QdrantConfigAdapter();
  }
}
