import { DynamicModule, Module } from '@nestjs/common';

import { ConfigFactoryService } from './config-factory.service';

@Module({})
export class ConfigFactoryModule {
  static forRoot(options?: { global: boolean }): DynamicModule {
    return {
      global: options.global,
      module: ConfigFactoryModule,
      providers: [ConfigFactoryService],
      exports: [ConfigFactoryService],
    };
  }
}
