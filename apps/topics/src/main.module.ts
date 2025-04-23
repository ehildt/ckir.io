import { SocketIOModule } from '@ckir.io/socket-io';
import { Logger, Module } from '@nestjs/common';

import { BullMQModule } from './bullmq/bullmq.module';
import { ConfigFactoryModule } from './config-factory/config-factory.module';
import { ConfigFactoryService } from './config-factory/config-factory.service';
import { TopicsController } from './controllers/topics.controller';
import { TopicsService } from './services/topics.service';

@Module({
  imports: [
    ConfigFactoryModule.forRoot({ global: true }),
    BullMQModule.registerAsync({
      global: true,
      inject: [ConfigFactoryService],
      usePinoFactory: async ({ pinoConfig }: ConfigFactoryService) => pinoConfig,
      useBullFactory: async ({ bullMQConfig }: ConfigFactoryService) => bullMQConfig,
    }),
    SocketIOModule.registerAsync({
      global: true,
      inject: [ConfigFactoryService],
      useFactory: async ({ socketIOConfig }: ConfigFactoryService) => socketIOConfig,
    }),
  ],
  providers: [Logger, TopicsService],
  controllers: [TopicsController],
})
export class MainModule {}
