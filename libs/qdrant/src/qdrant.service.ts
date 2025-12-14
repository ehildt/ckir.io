import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { QdrantClient } from '@qdrant/js-client-rest';
import { randomUUID } from 'crypto';
import { EmbeddingsResponse, EmbedResponse } from 'ollama';

import { QDRANT_CLIENT } from './qdrant.constants';
import { QdrantDistance, SearchArgs } from './qdrant.model';

/**
 * Service providing high-level access to Qdrant vector database.
 */
@Injectable()
export class QdrantService {
  /**
   * Creates a new collection in the Qdrant cluster.
   *
   * @param collection - The name of the collection to create.
   * @param size - The size of vectors to be stored in the collection.
   * @param distance - The distance metric to use (e.g., "Cosine", "Euclid", "Dot", "Manhattan").
   * @returns A Promise resolving to the creation response from Qdrant.
   */
  async createCollection(
    collection: string,
    size: number,
    distance: QdrantDistance = 'Cosine',
  ) {
    return this.qdrantClient.createCollection(collection, {
      vectors: { size, distance },
    });
  }

  /**
   * Upserts a single point (vector and optional payload) into a Qdrant collection.
   *
   * @param collection - The name of the collection.
   * @param id - A unique identifier for the point.
   * @param vector - The vector to insert or update.
   * @param payload - (Optional) Associated metadata payload as a key-value object.
   * @returns A Promise resolving to the upsert response from Qdrant.
   */
  async upsertPoints<T>(
    collection: string,
    embeddings: Array<EmbeddingsResponse> | EmbeddingsResponse,
    payload?: Partial<T>,
  ) {
    if (Array.isArray(embeddings))
      return this.qdrantClient.upsert(collection, {
        points: embeddings.map(({ embedding }) => ({
          id: randomUUID(),
          vector: embedding,
          payload,
        })),
      });

    return this.qdrantClient.upsert(collection, {
      points: [
        {
          id: randomUUID(),
          vector: embeddings.embedding,
          payload,
        },
      ],
    });
  }

  async upsertBatch<T>(
    collection: string,
    response: EmbedResponse,
    payload?: Partial<T>,
  ) {
    await this.qdrantClient.upsert(collection, {
      batch: {
        ids: response.embeddings.map(() => randomUUID()),
        vectors: response.embeddings,
        payloads: response.embeddings.map(() => payload),
      },
    });
  }

  /**
   * Performs an asynchronous vector similarity search on the specified collection.
   *
   * @param collection the name of the collection to search in.
   * @param vector the query vector to use for similarity search.
   * @param args optional search parameters:
   *   - `limit` the maximum number of results to return.
   *   - `offset` the number of results to skip (for pagination).
   *   - `filter` an object specifying field-value pairs to filter the search results.\
   *             Each key-value pair is transformed into a match condition.
   *
   * @returns a Promise resolving to the search results from the underlying vector database client.
   *
   * @example
   * ```ts
   * const results = await search("my_collection", [0.1, 0.2, 0.3], {
   *   limit: 10,
   *   offset: 0,
   *   filter: { category: "books" },
   * });
   * ```
   */
  async searchBatch(
    collection: string,
    vectors: number[][],
    args?: SearchArgs,
  ) {
    if (!Array.isArray(vectors) || vectors.length === 0)
      throw new BadRequestException('[Error] No vectors provided');
    const collectionInfo = await this.qdrantClient.getCollection(collection);
    const vectorSize = collectionInfo?.config?.params?.vectors?.size;
    if (!vectorSize || typeof vectorSize !== 'number')
      throw new NotFoundException(
        `[Error] Collection "${collection}" not found or vector size unknown`,
      );

    vectors.forEach((v, i) => {
      if (!Array.isArray(v) || v.length !== vectorSize)
        throw new BadRequestException(
          `[Error] Vector dimension mismatch at index ${i}. Expected: ${vectorSize}, Received: ${v?.length ?? 'undefined'}.`,
        );
    });

    return this.qdrantClient.searchBatch(collection, {
      searches: vectors.map((vector) => ({
        with_payload: true,
        vector,
        score_threshold: args?.score,
        limit: args?.limit,
        offset: args?.offset,
        filter: this.buildFilter(args?.filter),
      })),
    });
  }

  async listCollections() {
    return this.qdrantClient.getCollections();
  }

  async deleteCollection(collection: string) {
    return this.qdrantClient.deleteCollection(collection);
  }

  async deletePoints(collection: string, ids: string | string[]) {
    const normalizedIds = Array.isArray(ids) ? ids : [ids];
    const points = new Set(normalizedIds.filter((id) => Boolean(id?.trim())));
    if (!points.size)
      throw new BadRequestException('[Error] No point ids provided');
    return this.qdrantClient.delete(collection, {
      points: Array.from(points),
    });
  }

  private buildFilter(filterObj?: Record<string, any>) {
    if (filterObj)
      return {
        must: Object.entries(filterObj).map(([key, value]) => ({
          key,
          match: Array.isArray(value) ? { any: value } : { value },
        })),
      };
  }

  constructor(
    @Inject(QDRANT_CLIENT) private readonly qdrantClient: QdrantClient,
  ) {}
}
