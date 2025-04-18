import { Logger, Module } from '@nestjs/common';

import { BullMQModule } from './bullmq-processors/bullmq-processors.module';
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
    BullMQModule.registerAsync({
      isGlobal: true,
      inject: [ConfigFactoryService],
      usePinoFactory: async ({ pinoConfig }: ConfigFactoryService) => pinoConfig,
      useBullFactory: async ({ bullMQConfig }: ConfigFactoryService) => bullMQConfig,
    }),
    SocketIOModule.registerAsync({
      isGlobal: true,
      inject: [ConfigFactoryService],
      useFactory: async ({ socketIOConfig }: ConfigFactoryService) => socketIOConfig,
    }),
  ],
})
export class MainModule {}
