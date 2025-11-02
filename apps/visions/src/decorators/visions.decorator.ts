import { ApiBody, ApiQuery } from '@nestjs/swagger';

export const ApiBodyFileMultipart = () =>
  ApiBody({
    schema: {
      type: 'object',
      properties: {
        uuid: {
          type: 'string',
          description: 'The UUID to that SOCKET.IO will emit responses to.',
        },
        mode: {
          type: 'string',
          description: 'The visions supported operation modes',
          enum: ['describe', 'compare', 'ocr'],
        },
        files: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
          description: 'Upload one or more images (PNG/JPG/JPEG/WEBP)',
        },
        prompt: {
          type: 'string',
          description: 'Optional prompt for the AI model',
          nullable: true,
          example: '',
        },
      },
      required: ['files', 'mode', 'uuid'],
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
