import { BULLMQ_QUEUE, BullMQModule } from '@ehildt/ckir-bullmq';
import { BullMQPinoLoggerModule } from '@ehildt/ckir-bullmq-logger';
import { ConfigFactoryModule } from '@ehildt/ckir-config-factory';
import { OllamaModule } from '@ehildt/ckir-ollama';
import { SocketIOModule } from '@ehildt/ckir-socket-io';
import { Logger, Module } from '@nestjs/common';

import { AppConfigService } from './configs/app-config.service';
import { BullMQConfigService } from './configs/bullmq-config.service';
import { OllamaConfigService } from './configs/ollama-config.service';
import { SocketIOConfigService } from './configs/socket-io-config.service';
import { VisionsController } from './controllers/images.controller';
import { VisionsCompareProcessor } from './processors/visions-compare.processor';
import { VisionsDescribeProcessor } from './processors/visions-describe.processor';
import { VisionsOCRProcessor } from './processors/visions-ocr.processor';
import { VisionsService } from './services/visions.service';

@Module({
  controllers: [VisionsController],
  providers: [Logger, VisionsService],
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
      useFactory: async ({ config: xOllamaConfig }: OllamaConfigService) => ({
        host: xOllamaConfig.host,
      }),
    }),
    BullMQModule.registerAsync({
      global: true,
      inject: [BullMQConfigService],
      queues: [
        BULLMQ_QUEUE.IMAGE_OCR,
        BULLMQ_QUEUE.IMAGE_COMPARE,
        BULLMQ_QUEUE.IMAGE_DESCRIBE,
      ],
      processors: [
        VisionsDescribeProcessor,
        VisionsCompareProcessor,
        VisionsOCRProcessor,
      ],
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
      useFactory: async ({ config: socketIOConfig }: SocketIOConfigService) =>
        socketIOConfig,
    }),
  ],
})
export class MainModule {}
