export const ANALYZE_VISIONS = {
  type: 'function',
  function: {
    name: 'analyze_vision',
    description: [
      'Use ONLY for image understanding: describe, compare, and OCR images.',
      'REQUIRED whenever the request depends on image content.',
    ].join('\n'),
    parameters: {
      type: 'object',
      additionalProperties: false,
      properties: {},
    },
  },
};
