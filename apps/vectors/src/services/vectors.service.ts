import { QdrantDistance, QdrantEmbeddingSize, QdrantService, SearchArgs } from '@ckir.io/qdrant';
import { Injectable } from '@nestjs/common';
import { EmbeddingsResponse } from 'ollama';

@Injectable()
export class VectorsService {
  constructor(private readonly qdrantService: QdrantService) {}

  async createCollection(collection: string, vectorSize: QdrantEmbeddingSize, distance?: QdrantDistance) {
    return this.qdrantService.createCollection(collection, vectorSize, distance);
  }

  async upsertPoint(
    id: string | number,
    collection: string,
    embeddings: Array<EmbeddingsResponse> | EmbeddingsResponse,
    payload?: Record<string, unknown>,
  ) {
    return this.qdrantService.upsertPoints(collection, embeddings, payload);
  }

  async search(collection: string, vector: Array<number>, args?: SearchArgs) {
    return this.qdrantService.search(collection, vector, args);
  }
}
