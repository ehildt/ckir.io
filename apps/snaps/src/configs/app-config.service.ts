import { CacheReturnValue } from '@ckir.io/decorators';
import { AppConfigSchema } from '@ckir.io/helpers';
import { Injectable } from '@nestjs/common';

import { AppConfigAdapter } from './app-config.adapters';

@Injectable()
export class AppConfigService {
  @CacheReturnValue(AppConfigSchema)
  get appConfig() {
    return AppConfigAdapter();
  }
}
