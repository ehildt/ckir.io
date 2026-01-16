import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiConsumes, ApiQuery, ApiResponse } from '@nestjs/swagger';

import { ApiBodySchema, ApiTaskParam } from './visions.decorator';

export const ApiVision = () =>
  applyDecorators(
    ApiConsumes('multipart/form-data'),
    ApiResponse({
      status: HttpStatus.ACCEPTED,
      description: [
        'Accepted.',
        'Processing will occur asynchronously,',
        'and the result will be delivered via Socket.IO.',
      ].join(' '),
    }),
    ApiBodySchema(),
    ApiTaskParam(),
    ApiQuery({
      type: Boolean,
      default: 'false',
      required: false,
      name: 'stream',
    }),
    ApiQuery({
      name: 'numCtx',
      required: false,
      type: Number,
      example: '32000',
    }),
  );
