export const CREATE_EMBEDDINGS = {
  type: 'function',
  function: {
    name: 'create_embedding',
    description:
      'Create vector embeddings. Provide ONLY the payload content to embed (no instructions or meta text). If payload is unclear, ask the user to paste/quote the exact text to embed.',
    parameters: {
      type: 'object',
      additionalProperties: false,
      required: ['content'],
      properties: {
        content: {
          type: 'string',
          description:
            'Exact payload to embed. Exclude phrases like "create an embedding for" and exclude surrounding questions unless the question is explicitly the payload.',
          minLength: 1,
        },
      },
    },
  },
};
