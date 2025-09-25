import { BullMQModule } from '@ckir.io/bullmq';
import { OllamaModule } from '@ckir.io/ollama';
import { QdrantModule } from '@ckir.io/qdrant';
import { Logger, Module } from '@nestjs/common';

import { ConfigFactoryModule } from './config-factory/config-factory.module';
import { ConfigFactoryService } from './config-factory/config-factory.service';
import { BULLMQ_QUEUE } from './constants/bullmq.constants';
import { VectorsController } from './controllers/vectors.controller';
import { MessagesProcessor } from './processors/messages.processor';
import { ThreadsProcessor } from './processors/threads.processor';
import { TopicsProcessor } from './processors/topics.processor';
import { VectorsService } from './services/vectors.service';

@Module({
  controllers: [VectorsController],
  providers: [Logger, VectorsService],
  imports: [
    ConfigFactoryModule.forRoot({ global: true }),
    OllamaModule.registerAsync({
      global: true,
      inject: [ConfigFactoryService],
      useFactory: async ({ ollamaConfig }: ConfigFactoryService) => ({ host: ollamaConfig.host }),
    }),
    QdrantModule.registerAsync({
      global: true,
      inject: [ConfigFactoryService],
      useFactory: async ({ qdrantConfig }: ConfigFactoryService) => qdrantConfig,
    }),
    BullMQModule.registerAsync({
      global: true,
      inject: [ConfigFactoryService],
      queues: [BULLMQ_QUEUE.VECTORIZE_MESSAGE, BULLMQ_QUEUE.VECTORIZE_THREAD, BULLMQ_QUEUE.VECTORIZE_TOPIC],
      processors: [MessagesProcessor, ThreadsProcessor, TopicsProcessor],
      usePinoFactory: async ({ pinoConfig }: ConfigFactoryService) => pinoConfig,
      useBullFactory: async ({ bullMQConfig }: ConfigFactoryService) => bullMQConfig,
    }),
  ],
})
export class MainModule {}
