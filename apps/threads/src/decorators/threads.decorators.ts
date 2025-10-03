import { ProcessingMode, ThreadsRes } from '@ckir.io/dtos';
import {
  applyDecorators,
  HttpCode,
  HttpStatus,
  ParseEnumPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

const REQUEST_SUCCESSFUL = 'Message emitted successfully';

export const QueryGatewayMode = () =>
  Query('gateway', new ParseEnumPipe(ProcessingMode, { optional: true }));

export const PostThreadReq = () =>
  applyDecorators(
    Post(),
    HttpCode(202),
    ApiQuery({
      name: 'mode',
      enum: ProcessingMode,
      required: false,
      description: `
      Persist saves the thread, Vectorize generates an embedding and stores it with the thread payload, 
      and leaving empty (--) only emits the thread through Socket.IO.
      `,
    }),
    ApiBody({ required: true, type: ThreadsRes }),
    ApiResponse({
      description: REQUEST_SUCCESSFUL,
      status: HttpStatus.ACCEPTED,
    }),
    ApiOperation({
      description: `
                  Handles threads by emitting them in real-time and optionally queueing them for persistence and vectorization. 
                  threads can be stored for future retrieval or processed for AI-based analysis using BullMQ.`,
    }),
  );
