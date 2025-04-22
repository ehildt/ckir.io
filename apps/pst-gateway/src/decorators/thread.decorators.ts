import { applyDecorators, Get, HttpCode, HttpStatus, ParseIntPipe, Post, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

import { GatewayMode } from '@/constants/gateway-mode.constants';
import { ThreadReq } from '@/dtos/thread-req.dto';

const REQUEST_SUCCESSFUL = 'Message emitted successfully';

export const QueryTopicId = () => Query('topicId');
export const QueryLimit = () => Query('limit', new ParseIntPipe({ optional: true }));
export const QuerySkip = () => Query('skip', new ParseIntPipe({ optional: true }));

export const GetThreadsReq = () =>
  applyDecorators(
    Get(),
    ApiResponse({ description: REQUEST_SUCCESSFUL, type: ThreadReq, isArray: true }),
    ApiQuery({ name: 'topicId' }),
    ApiQuery({ name: 'limit', default: 10, required: false }),
    ApiQuery({ name: 'skip', default: 0, required: false }),
  );

export const PosThreadReq = () =>
  applyDecorators(
    Post('threads'),
    HttpCode(202),
    ApiQuery({ name: 'gateway', enum: [GatewayMode.PERSIST], required: false }),
    ApiBody({ required: true, type: ThreadReq }),
    ApiResponse({ description: REQUEST_SUCCESSFUL, status: HttpStatus.ACCEPTED }),
    ApiOperation({
      description: 'Handles chat threads by queueing them for persistence',
    }),
  );
