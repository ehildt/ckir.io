import { PostsRes, ProcessingMode } from '@ehildt/ckir-dtos';
import {
  applyDecorators,
  HttpCode,
  HttpStatus,
  ParseEnumPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

const REQUEST_SUCCESSFUL = 'Post emitted successfully';

export const QueryGatewayMode = () =>
  Query('gateway', new ParseEnumPipe(ProcessingMode, { optional: true }));

export const ApiPostsReq = () =>
  applyDecorators(
    Post(),
    HttpCode(202),
    ApiQuery({
      name: 'mode',
      enum: ProcessingMode,
      required: false,
      description: `
      Persist saves the post, Vectorize generates an embedding and stores it with the post payload, 
      and leaving empty (--) only emits the post through Socket.IO.
      `,
    }),
    ApiBody({ required: true, type: PostsRes }),
    ApiResponse({
      description: REQUEST_SUCCESSFUL,
      status: HttpStatus.ACCEPTED,
    }),
    ApiOperation({
      description: `
              Handles posts by emitting them in real-time and optionally queueing them for persistence and vectorization. 
              Posts can be stored for future retrieval or processed for AI-based analysis using BullMQ.`,
    }),
  );
