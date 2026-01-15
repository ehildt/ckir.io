import { SupportedToolFunction } from '@/dtos/json-rpc/mcp.model';

export const VECTORS_UPSERT_POINTS = {
  name: 'vectors.collection.embed.upsert' satisfies SupportedToolFunction,
  description: [
    'Upsert a vector embedding for a given text.',
    'Input must contain only the raw text to embed, without instructions, metadata, or contextual framing.',
    'If the text is ambiguous, prompt the user to provide the exact text to embed.',
  ].join(' '),
  inputSchema: {
    type: 'object',
    additionalProperties: false,
    required: ['collection', 'content'],
    properties: {
      collection: {
        type: 'string',
        description: 'Name of the collection where the vector will be stored.',
        minLength: 3,
      },
      includeVector: {
        type: 'boolean',
        default: false,
        description: [
          'If set to true, includes the vector in the response.',
          'If false or omitted, the vector is excluded. Defaults to false.',
        ].join(' '),
      },
      content: {
        type: 'string',
        description: [
          'The exact text to embed as a vector.',
          'Exclude instructions, prompts, or conversational context unrelated to the text itself.',
          'Include questions only if the question is the content intended for embedding.',
        ].join(' '),
        minLength: 3,
      },
      payload: {
        type: 'object',
        description: 'Optional JSON metadata to store alongside the vector.',
      },
    },
  },
} as const;
