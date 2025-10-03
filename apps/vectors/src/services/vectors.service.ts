import {
  QdrantDistance,
  QdrantEmbeddingSize,
  QdrantService,
  SearchArgs,
} from '@ckir.io/qdrant';
import { Injectable } from '@nestjs/common';
import { EmbeddingsResponse } from 'ollama';

@Injectable()
export class VectorsService {
  constructor(private readonly qdrantService: QdrantService) {}

  async createCollection(
    collection: string,
    vectorSize: QdrantEmbeddingSize,
    distance?: QdrantDistance,
  ) {
    return await this.qdrantService.createCollection(
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
}
