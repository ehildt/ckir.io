import { applyDecorators, HttpCode, HttpStatus, ParseEnumPipe, Post, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

import { GatewayMode } from '@/constants/gateway-mode.constants';
import { MessageReq } from '@/dtos/message-req.dto';
import { ThreadReq } from '@/dtos/thread-req.dto';
import { TopicReq } from '@/dtos/topic-req.dto';

const REQUEST_SUCCESSFUL = 'Message emitted successfully';

export const QueryGatewayMode = () => Query('gateway', new ParseEnumPipe(GatewayMode, { optional: true }));

export const PosTopicReq = () =>
  applyDecorators(
    Post('topics'),
    HttpCode(202),
    ApiQuery({ name: 'gateway', enum: GatewayMode, required: false }),
    ApiBody({ required: true, type: TopicReq }),
    ApiResponse({ description: REQUEST_SUCCESSFUL, status: HttpStatus.ACCEPTED }),
    ApiOperation({
      description: 'Handles chat topics by queueing them for persistence',
    }),
  );

export const PosThreadReq = () =>
  applyDecorators(
    Post('threads'),
    HttpCode(202),
    ApiQuery({ name: 'gateway', enum: GatewayMode, required: false }),
    ApiBody({ required: true, type: ThreadReq }),
    ApiResponse({ description: REQUEST_SUCCESSFUL, status: HttpStatus.ACCEPTED }),
    ApiOperation({
      description: 'Handles chat threads by queueing them for persistence',
    }),
  );

export const PostMessageReq = () =>
  applyDecorators(
    Post('messages'),
    HttpCode(202),
    ApiQuery({ name: 'gateway', enum: GatewayMode, required: false }),
    ApiBody({ required: true, type: MessageReq }),
    ApiResponse({ description: REQUEST_SUCCESSFUL, status: HttpStatus.ACCEPTED }),
    ApiOperation({
      description: 'Handles chat messages by queueing them for persistence',
    }),
  );
