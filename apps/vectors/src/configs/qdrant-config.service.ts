import { QdrantClientConfigSchema, QdrantConfigAdapter } from '@ckir.io/qdrant';
import { CacheReturnValue } from '@ehildt/ckir-config-factory';
import { Injectable } from '@nestjs/common';

@Injectable()
export class QdrantConfigService {
  @CacheReturnValue(QdrantClientConfigSchema)
  get qdrantConfig() {
    return QdrantConfigAdapter();
  }
}
