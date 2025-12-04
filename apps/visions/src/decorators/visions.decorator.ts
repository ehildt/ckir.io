import { SOCKET_IO_EVENT } from '@ehildt/ckir-socket-io';
import { ApiBody, ApiQuery } from '@nestjs/swagger';

export const ApiBodyFileMultipart = () =>
  ApiBody({
    schema: {
      type: 'object',
      properties: {
        groupId: {
          type: 'string',
          example: 'grp_01HZX2FBT8Z3K9M3YQ0E2N4A7C',
          description:
            'Identifier for the logical group/context this request belongs to.',
        },
        visionAgent: {
          type: 'string',
          example: 'gemma3:27b',
          description:
            'The large language model that should be used as the visions model',
        },
        textAgent: {
          type: 'string',
          example: 'gemma3:27b',
          description:
            '(Optional) The large language model that should be used as the text model',
        },
        room: {
          type: 'string',
          example: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
          description: `The room of the event<${SOCKET_IO_EVENT.VISION}> to that SOCKET.IO will emit responses to.`,
        },
        task: {
          type: 'string',
          description: 'The visions supported operation tasks',
          enum: ['describe', 'compare', 'ocr'],
        },
        stream: {
          type: 'boolean',
          description:
            'If true, the text is streamed; otherwise, the call waits for the model to finish and returns the full response at once.',
          default: false,
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
      required: ['files', 'task', 'room', 'visionAgent', 'groupId'],
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
