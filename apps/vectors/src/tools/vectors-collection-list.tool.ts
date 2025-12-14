import { SupportedToolFunction } from '@/dtos/supported-tools.model';

export const VECTORS_LIST_COLLECTIONS = {
  name: 'vectors.collection.list' satisfies SupportedToolFunction,
  description: 'Lists available collections.',
  inputSchema: {
    type: 'object',
    additionalProperties: false,
    properties: Object.freeze({}),
  },
} as const;
