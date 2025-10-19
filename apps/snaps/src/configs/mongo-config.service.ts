import { CacheReturnValue } from '@ehildt/ckir-config-factory';
import { Injectable } from '@nestjs/common';

import { MongoConfigAdapter } from './mongo-config.adapter';
import { MongoConfigSchema } from './mongo-config.schema';

@Injectable()
export class MongoConfigService {
  @CacheReturnValue(MongoConfigSchema)
  get mongoConfig() {
    return MongoConfigAdapter();
  }
}
