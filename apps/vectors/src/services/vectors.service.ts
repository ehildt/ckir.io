import { TextToLines } from '@ehildt/ckir-helpers';
import { OllamaService } from '@ehildt/ckir-ollama';
import {
  QdrantDistance,
  QdrantEmbeddingSize,
  QdrantService,
  SearchArgs,
} from '@ehildt/ckir-qdrant';
import { BadRequestException, Injectable } from '@nestjs/common';
import { EmbeddingsResponse } from 'ollama';

import { OllamaConfigService } from '@/configs/ollama-config.service';
import { CollectionEmbedUpsertReq } from '@/dtos/vectors/collection-embed-upsert-req.dto';

@Injectable()
export class VectorsService {
  constructor(
    private readonly qdrantService: QdrantService,
    private readonly ollamaService: OllamaService,
    private readonly ollamaConfigService: OllamaConfigService,
  ) {}

  async createCollection(
    collection: string,
    vectorSize: QdrantEmbeddingSize,
    distance?: QdrantDistance,
  ) {
    return this.qdrantService.createCollection(
      collection,
      vectorSize,
      distance,
    );
  }

  async upsertPoint(
    collection: string,
    embeddings: Array<EmbeddingsResponse> | EmbeddingsResponse,
    payload?: Record<string, unknown>,
  ) {
    return this.qdrantService.upsertPoints(collection, embeddings, payload);
  }

  async searchBatch(
    collection: string,
    vectors: number[][],
    args?: SearchArgs,
  ) {
    return this.qdrantService.searchBatch(collection, vectors, args);
  }

  async upsertEmbeddings(collection: string, req: CollectionEmbedUpsertReq) {
    if (!req.content) throw new BadRequestException('text is required');
    const response = await this.ollamaService.embed({
      input: new TextToLines(req.content).build(),
      keep_alive: this.ollamaConfigService.xOllamaConfig.keepAlive,
      model:
        this.ollamaConfigService.xOllamaConfig.x_options.textEmbeddingModel,
    });

    await this.qdrantService.upsertPoints(
      collection,
      response.embeddings.map((embedding) => ({ embedding })),
      req.payload,
    );

    return response;
  }
}
