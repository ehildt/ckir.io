import { applyDecorators, Get, HttpCode, HttpStatus, ParseIntPipe, Post, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

import { GatewayMode } from '@/constants/gateway-mode.constants';
import { TopicReq } from '@/dtos/topic-req.dto';

const REQUEST_SUCCESSFUL = 'Message emitted successfully';

export const QueryLimit = () => Query('limit', new ParseIntPipe({ optional: true }));
export const QuerySkip = () => Query('skip', new ParseIntPipe({ optional: true }));

export const GetTopicsReq = () =>
  applyDecorators(
    Get(),
    ApiResponse({ description: REQUEST_SUCCESSFUL, type: TopicReq, isArray: true }),
    ApiQuery({ name: 'limit', default: 10, required: false }),
    ApiQuery({ name: 'skip', default: 0, required: false }),
  );

export const PosTopicReq = () =>
  applyDecorators(
    Post('topics'),
    HttpCode(202),
    ApiQuery({ name: 'gateway', enum: [GatewayMode.PERSIST], required: false }),
    ApiBody({ required: true, type: TopicReq }),
    ApiResponse({ description: REQUEST_SUCCESSFUL, status: HttpStatus.ACCEPTED }),
    ApiOperation({
      description: 'Handles chat topics by queueing them for persistence',
    }),
  );
