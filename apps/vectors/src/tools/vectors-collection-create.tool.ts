import {
  QDRANT_DISTANCE_VALUES,
  QDRANT_EMBEDDING_DIMENSIONS,
  QdrantEmbeddingSize,
} from '@ehildt/ckir-qdrant';

import { SupportedToolFunction } from '@/dtos/supported-tools.model';

export const VECTORS_CREATE_COLLECTION = {
  name: 'vectors.collection.create' satisfies SupportedToolFunction,
  description: [
    'Create a new vector collection for storing embeddings.',
    'Requires a collection name and vector dimension.',
    'Similarity metric defaults to "Cosine" unless specified.',
  ].join(' '),
  inputSchema: {
    type: 'object',
    additionalProperties: false,
    required: ['collection', 'dimension'],
    properties: {
      collection: {
        type: 'string',
        description: 'Name of the collection to create.',
        minLength: 3,
      },
      dimension: {
        type: 'integer',
        description: 'Vector dimension for embeddings in this collection.',
        enum: QDRANT_EMBEDDING_DIMENSIONS,
        default: QdrantEmbeddingSize.Size768,
      },
      distance: {
        type: 'string',
        description: 'Similarity metric used for searching vectors.',
        enum: QDRANT_DISTANCE_VALUES,
        default: QDRANT_DISTANCE_VALUES[0], // Cosine
      },
    },
  },
} as const;
