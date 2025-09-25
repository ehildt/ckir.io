import { QdrantDistance, QdrantEmbeddingSize, QdrantSearchResponse, QdrantService, SearchArgs } from '@ckir.io/qdrant';
import { Injectable } from '@nestjs/common';
import { EmbeddingsResponse } from 'ollama';

@Injectable()
export class VectorsService {
  constructor(private readonly qdrantService: QdrantService) {}

  async createCollection(collection: string, vectorSize: QdrantEmbeddingSize, distance?: QdrantDistance) {
    return await this.qdrantService.createCollection(collection, vectorSize, distance);
  }

  async upsertPoint(
    collection: string,
    embeddings: Array<EmbeddingsResponse> | EmbeddingsResponse,
    payload?: Record<string, unknown>,
  ) {
    return this.qdrantService.upsertPoints(collection, embeddings, payload);
  }

  async search(collection: string, vector: Array<number>, args?: SearchArgs) {
    return this.deduplicateByPayloadId(await this.qdrantService.search(collection, vector, args));
  }

  private deduplicateByPayloadId(items: QdrantSearchResponse[]): QdrantSearchResponse[] {
    const seen = new Set<string | number>();
    const result: Array<QdrantSearchResponse> = [];
    for (const item of items) {
      const key = (item.payload?.messageId ?? item.payload?.topicId ?? item.payload?.threadId) as string;
      if (!key) continue;
      if (!seen.has(key)) {
        seen.add(key);
        result.push(item);
      }
    }
    return result;
  }
}
