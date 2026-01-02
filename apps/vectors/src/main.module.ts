import { ConfigFactoryModule } from '@ehildt/ckir-config-factory';
import { OllamaModule } from '@ehildt/ckir-ollama';
import { QdrantModule } from '@ehildt/ckir-qdrant';
import { Logger, Module } from '@nestjs/common';

import { AppConfigService } from './configs/app-config.service';
import { OllamaConfigService } from './configs/ollama-config.service';
import { QdrantConfigService } from './configs/qdrant-config.service';
import { ClassicController } from './controllers/classic.controller';
import { JsonRpcController } from './controllers/json-rpc.controller';
import { McpVectorsService } from './services/mcp-vectors.service';
import { VectorsService } from './services/vectors.service';

@Module({
  controllers: [ClassicController, JsonRpcController],
  providers: [Logger, VectorsService, McpVectorsService],
  imports: [
    ConfigFactoryModule.forRoot({
      global: true,
      providers: [AppConfigService, OllamaConfigService, QdrantConfigService],
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
  ],
})
export class MainModule {}
