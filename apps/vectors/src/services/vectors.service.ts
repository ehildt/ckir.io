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
import { CollectionEmbedUpsertReq } from '@/dtos/classic/collection-embed-upsert-req.dto';

@Injectable()
export class VectorsService {
  constructor(
    private readonly qdrantService: QdrantService,
    private readonly ollamaService: OllamaService,
    private readonly ollamaConfigService: OllamaConfigService,
  ) {}

  async listCollections() {
    return this.qdrantService.listCollections();
  }

  async deleteCollection(collection: string) {
    return this.qdrantService.deleteCollection(collection);
  }

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

  async deletePoints(collection: string, pointIds: Array<string>) {
    return this.qdrantService.deletePoints(collection, pointIds);
  }

  async searchBatch(
    collection: string,
    vectors: number[][],
    args?: SearchArgs,
  ) {
    return this.qdrantService.searchBatch(collection, vectors, args);
  }

  async upsertEmbeddings(
    collection: string,
    req: CollectionEmbedUpsertReq,
    xEmbeddingLLM: string,
  ) {
    if (!req.text) throw new BadRequestException('text is required');
    const response = await this.ollamaService.embed({
      input: new TextToLines(req.text).build(),
      keep_alive: this.ollamaConfigService.xOllamaConfig.keepAlive,
      model: xEmbeddingLLM,
    });

    await this.qdrantService.upsertPoints(
      collection,
      response.embeddings.map((embedding) => ({ embedding })),
      req.payload,
    );

    return response;
  }
}
