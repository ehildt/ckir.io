import { BullMQModule } from '@ckir.io/bullmq';
import { OllamaModule } from '@ckir.io/ollama';
import { QdrantModule } from '@ckir.io/qdrant';
import { Logger, Module } from '@nestjs/common';

import { ConfigFactoryModule } from './config-factory/config-factory.module';
import { ConfigFactoryService } from './config-factory/config-factory.service';
import { BULLMQ_QUEUE } from './constants/bullmq.constants';
import { VisionsController } from './controllers/vectors.controller';
import { ImagesProcessor } from './processors/images.processor';
import { VectorsService } from './services/vectors.service';

@Module({
  controllers: [VisionsController],
  providers: [Logger, VectorsService],
  imports: [
    ConfigFactoryModule.forRoot({ global: true }),
    OllamaModule.registerAsync({
      global: true,
      inject: [ConfigFactoryService],
      useFactory: async ({ ollamaConfig }: ConfigFactoryService) => ({
        host: ollamaConfig.host,
      }),
    }),
    QdrantModule.registerAsync({
      global: true,
      inject: [ConfigFactoryService],
      useFactory: async ({ qdrantConfig }: ConfigFactoryService) =>
        qdrantConfig,
    }),
    BullMQModule.registerAsync({
      global: true,
      inject: [ConfigFactoryService],
      queues: [
        BULLMQ_QUEUE.VECTORIZE_POSTS,
        BULLMQ_QUEUE.VECTORIZE_THREAD,
        BULLMQ_QUEUE.VECTORIZE_TOPIC,
      ],
      processors: [ImagesProcessor],
      usePinoFactory: async ({ pinoConfig }: ConfigFactoryService) =>
        pinoConfig,
      useBullFactory: async ({ bullMQConfig }: ConfigFactoryService) =>
        bullMQConfig,
    }),
  ],
})
export class MainModule {}
