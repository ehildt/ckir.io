import { Logger, Module } from '@nestjs/common';

import { ConfigFactoryModule } from './config-factory/config-factory.module';

@Module({
  imports: [ConfigFactoryModule.forRoot({ global: true })],
  providers: [Logger],
  controllers: [],
})
export class MainModule {}
