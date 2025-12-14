import { SupportedToolFunction } from '@/dtos/supported-tools.model';

export const VECTORS_DELETE_POINTS = {
  name: 'vectors.collection.embed.delete' satisfies SupportedToolFunction,
  description: [
    'Delete embeddings from a collection by specifying the point IDs.',
    'Use this when each point in the collection stores a single unnamed vector.',
  ].join(' '),
  inputSchema: {
    type: 'object',
    additionalProperties: false,
    required: ['collection', 'pointIds'],
    properties: {
      collection: {
        type: 'string',
        description:
          'Name of the collection from which points will be deleted.',
        minLength: 3,
      },
      pointIds: {
        type: 'array',
        description: 'Array of point IDs to delete.',
        minItems: 1,
        items: { type: 'string', minLength: 1 },
      },
    },
  },
} as const;
