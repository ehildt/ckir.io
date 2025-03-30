import { DynamicModule, Logger, Module } from '@nestjs/common';

import { ConfigFactoryLoader } from './config-factory.loader';
import { ConfigFactoryService } from './config-factory.service';

@Module({
  providers: [ConfigFactoryService, ConfigFactoryLoader, Logger],
  exports: [ConfigFactoryService, ConfigFactoryLoader],
})
export class ConfigFactoryModule {
  static forRoot(options?: { isGlobal: boolean }): DynamicModule {
    return {
      global: options.isGlobal,
      module: ConfigFactoryModule,
    };
  }
}
