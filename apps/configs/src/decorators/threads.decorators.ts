import { applyDecorators, HttpCode, HttpStatus, ParseEnumPipe, Post, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

import { GatewayMode } from '@/constants/gateway-mode.constants';
import { ThreadReq } from '@/dtos/thread-req.dto';

const REQUEST_SUCCESSFUL = 'Message emitted successfully';

export const QueryGatewayMode = () => Query('gateway', new ParseEnumPipe(GatewayMode, { optional: true }));

export const PostThreadReq = () =>
  applyDecorators(
    Post('threads'),
    HttpCode(202),
    ApiQuery({ name: 'gateway', enum: GatewayMode, required: false }),
    ApiBody({ required: true, type: ThreadReq }),
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
