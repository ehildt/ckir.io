import { CacheReturnValue } from '@ehildt/ckir-config-factory';
import {
  QdrantClientConfigSchema,
  QdrantConfigAdapter,
} from '@ehildt/ckir-qdrant';
import { Injectable } from '@nestjs/common';

@Injectable()
export class QdrantConfigService {
  @CacheReturnValue(QdrantClientConfigSchema)
  get qdrantConfig() {
    return QdrantConfigAdapter();
  }
}
