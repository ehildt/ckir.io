import { QdrantEmbeddingSize } from '@ehildt/ckir-qdrant';

import { SupportedToolFunction } from '@/dtos/supported-tools.model';

export const VECTORS_COLLECTION_SEARCH_VECTOR = {
  name: 'vectors.collection.search.vector' satisfies SupportedToolFunction,
  description: [
    'Search a vector collection using a query vector.',
    'Provide only the raw query vector without instructions, metadata, or framing.',
    'Results are ranked by semantic similarity; use limit/offset for pagination and score to filter weaker matches.',
  ].join(' '),
  inputSchema: {
    type: 'object',
    additionalProperties: false,
    required: ['collection', 'vector'],
    properties: {
      collection: {
        type: 'string',
        description: 'Name of the collection to search.',
        minLength: 3,
      },
      vector: {
        type: 'array',
        description: 'The exact query vector to use for searching.',
        items: { type: 'number' },
        minItems: QdrantEmbeddingSize.Size128,
        maxItems: QdrantEmbeddingSize.Size2048,
      },
      limit: {
        type: 'integer',
        description: 'Maximum number of results to return.',
        minimum: 1,
        default: 10,
      },
      offset: {
        type: 'integer',
        description: 'Number of results to skip for pagination.',
        minimum: 0,
        default: 0,
      },
      score: {
        type: 'number',
        description:
          'Minimum similarity score threshold; lower values return more, potentially weaker matches.',
        minimum: 0,
        maximum: 1,
        default: 0.6,
      },
      filters: {
        type: 'object',
        description: [
          'Optional metadata filters to restrict which documents are considered in the search.',
          'Provide an object with properties representing the metadata criteria to filter by.',
          'This schema does not enforce specific field names or filter syntax.',
          'Example: to filter by type "cars", use { "type": "cars" }.',
          'If omitted, the search runs without metadata constraints.',
        ].join(' '),
      },
    },
  },
} as const;
