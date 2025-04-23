import { OllamaModule } from '@ckir.io/ollama';
import { QdrantModule } from '@ckir.io/qdrant';
import { Logger, Module } from '@nestjs/common';

import { BullMQProcessorsModule } from './bullmq/bullmq.module';
import { ConfigFactoryModule } from './config-factory/config-factory.module';
import { ConfigFactoryService } from './config-factory/config-factory.service';
import { VectorsController } from './controllers/vectors.controller';
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
    BullMQProcessorsModule.registerAsync({
      global: true,
      inject: [ConfigFactoryService],
      usePinoFactory: async ({ pinoConfig }: ConfigFactoryService) => pinoConfig,
      useBullFactory: async ({ bullMQConfig }: ConfigFactoryService) => bullMQConfig,
    }),
  ],
})
export class MainModule {}
