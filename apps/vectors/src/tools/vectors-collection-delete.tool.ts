import { SupportedToolFunction } from '@/dtos/supported-tools.model';

export const VECTORS_DELETE_COLLECTION = {
  name: 'vectors.collection.delete' satisfies SupportedToolFunction,
  description: 'Delete an entire vector collection.',
  inputSchema: {
    type: 'object',
    additionalProperties: false,
    required: ['collection'],
    properties: Object.freeze({
      collection: {
        type: 'string',
        description: 'Name of the collection to delete.',
        minLength: 3,
      },
    }),
  },
} as const;
