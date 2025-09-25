import { QdrantDistance, QdrantEmbeddingSize, QdrantSearchResponses, QdrantService, SearchArgs } from '@ckir.io/qdrant';
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

  async searchBatch(collection: string, vectors: number[][], args?: SearchArgs) {
    return this.deduplicateAndAggregate(await this.qdrantService.searchBatch(collection, vectors, args));
  }

  private deduplicateAndAggregate(items: QdrantSearchResponses) {
    const aggregation = new Map<string, any>();
    const flatItems = items.flat().sort((a: any, b: any) => b.score - a.score);

    for (const item of flatItems) {
      const key = item.score.toFixed(4);
      if (!aggregation.has(key)) {
        aggregation.set(key, {
          ids: [item.payload?.id],
          matches: [item],
        });
      } else {
        const agg = aggregation.get(key)!;
        agg.matches.push(item);
        agg.ids.push(item.payload?.id);
      }
    }

    return Array.from(aggregation.values());
  }
}
