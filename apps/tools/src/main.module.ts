import {
  BULLMQ_QUEUE,
  BullMQModule,
  BullMQPinoLoggerModule,
} from '@ehildt/ckir-bullmq';
import { ConfigFactoryModule } from '@ehildt/ckir-config-factory';
import { OllamaModule } from '@ehildt/ckir-ollama';
import { SocketIOModule } from '@ehildt/ckir-socket-io';
import { Logger, Module } from '@nestjs/common';

import { AppConfigService } from './configs/app-config.service';
import { BullMQConfigService } from './configs/bullmq-config.service';
import { OllamaConfigService } from './configs/ollama-config.service';
import { SocketIOConfigService } from './configs/socket-io-config.service';
import { ToolsController } from './controllers/tools.controller';
import { ToolsProcessor } from './processors/tools.processor';
import { ToolsService } from './services/tools.service';

@Module({
  controllers: [ToolsController],
  providers: [Logger, ToolsService],
  imports: [
    ConfigFactoryModule.forRoot({
      global: true,
      providers: [
        AppConfigService,
        BullMQConfigService,
        OllamaConfigService,
        SocketIOConfigService,
      ],
    }),
    OllamaModule.registerAsync({
      global: true,
      inject: [OllamaConfigService],
      useFactory: async ({ xOllamaConfig }: OllamaConfigService) => ({
        host: xOllamaConfig.host,
      }),
    }),
    BullMQModule.registerAsync({
      global: true,
      inject: [BullMQConfigService],
      queues: [BULLMQ_QUEUE.BROADCAST_TOOL],
      processors: [ToolsProcessor],
      usePinoFactory: async ({ pinoConfig }: BullMQConfigService) => pinoConfig,
      useBullFactory: async ({ bullMQConfig }: BullMQConfigService) =>
        bullMQConfig,
    }),
    BullMQPinoLoggerModule.registerAsync({
      inject: [BullMQConfigService],
      useFactory: async ({ pinoConfig }: BullMQConfigService) => pinoConfig,
    }),
    SocketIOModule.registerAsync({
      global: true,
      inject: [SocketIOConfigService],
      useFactory: async ({ socketIOConfig }: SocketIOConfigService) =>
        socketIOConfig,
    }),
  ],
})
export class MainModule {}
