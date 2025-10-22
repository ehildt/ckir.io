import { ConfigFactoryModule } from '@ehildt/ckir-config-factory';
import { OllamaModule } from '@ehildt/ckir-ollama';
import { QdrantModule } from '@ehildt/ckir-qdrant';
import { Logger, Module } from '@nestjs/common';

import { AppConfigService } from './configs/app-config.service';
import { BullMQConfigService } from './configs/bullmq-config.service';
import { OllamaConfigService } from './configs/ollama-config.service';
import { QdrantConfigService } from './configs/qdrant-config.service';
import { ImagesController } from './controllers/images.controller';
import { VectorsService } from './services/vectors.service';

@Module({
  controllers: [ImagesController],
  providers: [Logger, VectorsService],
  imports: [
    ConfigFactoryModule.forRoot({
      global: true,
      providers: [
        AppConfigService,
        BullMQConfigService,
        OllamaConfigService,
        QdrantConfigService,
      ],
    }),
    OllamaModule.registerAsync({
      global: true,
      inject: [OllamaConfigService],
      useFactory: async ({ xOllamaConfig }: OllamaConfigService) => ({
        host: xOllamaConfig.host,
      }),
    }),
    QdrantModule.registerAsync({
      global: true,
      inject: [QdrantConfigService],
      useFactory: async ({ qdrantConfig }: QdrantConfigService) => qdrantConfig,
    }),
    // BullMQModule.registerAsync({
    //   global: true,
    //   inject: [BullMQConfigService],
    //   queues: [
    //     BULLMQ_QUEUE.VECTORIZE_POST,
    //     BULLMQ_QUEUE.VECTORIZE_THREAD,
    //     BULLMQ_QUEUE.VECTORIZE_TOPIC,
    //   ],
    //   processors: [PostsProcessor, ThreadsProcessor, TopicsProcessor],
    //   usePinoFactory: async ({ pinoConfig }: BullMQConfigService) => pinoConfig,
    //   useBullFactory: async ({ bullMQConfig }: BullMQConfigService) =>
    //     bullMQConfig,
    // }),
  ],
})
export class MainModule {}
