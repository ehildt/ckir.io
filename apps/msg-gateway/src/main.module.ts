import { Logger, Module } from '@nestjs/common';

import { ConfigFactoryModule } from './config-factory/config-factory.module';
import { ConfigFactoryService } from './config-factory/config-factory.service';
import { MainService } from './main.service';
import { MessagesModule } from './messages/messages.module';
import { SocketIOModule } from './socket-io/socket-io.module';

@Module({
  providers: [MainService, Logger],
  imports: [
    MessagesModule,
    ConfigFactoryModule.forRoot({ isGlobal: true }),
    SocketIOModule.register({
      isGlobal: true,
      inject: [ConfigFactoryService],
      useFactory: ({ socketIOConfig }: ConfigFactoryService) => socketIOConfig,
    }),
  ],
})
export class MainModule {}
