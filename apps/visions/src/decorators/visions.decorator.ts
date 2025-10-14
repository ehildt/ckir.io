import { ApiBody, ApiQuery } from '@nestjs/swagger';

export const ApiBodyFileMultipart = () =>
  ApiBody({
    required: true,
    type: 'object',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Upload an image (PNG/JPG/JPEG/WEBP)',
        },
      },
    },
  });

export const ApiQueryStream = () =>
  ApiQuery({
    type: Boolean,
    required: false,
    name: 'stream',
    default: 'false',
    description:
      'Specifies whether the response should be streamed or returned as a single complete result.',
  });

export const ApiQueryFocus = () =>
  ApiQuery({
    type: Boolean,
    required: false,
    name: 'focus',
    default: 'false',
    description:
      'Will try to describe only the main subject that is in focus and ignore everything else.',
  });

export const ApiQueryPrompts = () =>
  ApiQuery({
    name: 'prompts',
    type: String,
    isArray: true,
    required: false,
    description: 'Array of string prompts',
  });
