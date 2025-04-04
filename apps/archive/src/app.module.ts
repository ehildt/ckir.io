import { Logger, Module } from '@nestjs/common';

import { AppService } from '@/app.service';
import { ConfigFactoryModule } from '@/config-factory/config-factory.module';

@Module({
  imports: [ConfigFactoryModule.forRoot({ isGlobal: true })],
  providers: [AppService, Logger],
})
export class AppModule {}
