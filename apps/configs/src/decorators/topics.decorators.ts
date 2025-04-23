import { applyDecorators, HttpCode, HttpStatus, ParseEnumPipe, Post, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

import { GatewayMode } from '@/constants/gateway-mode.constants';
import { TopicReq } from '@/dtos/topic-req.dto';

const REQUEST_SUCCESSFUL = 'Message emitted successfully';

export const QueryGatewayMode = () => Query('gateway', new ParseEnumPipe(GatewayMode, { optional: true }));

export const PostTopicsReq = () =>
  applyDecorators(
    Post('topics'),
    HttpCode(202),
    ApiQuery({ name: 'gateway', enum: GatewayMode, required: false }),
    ApiBody({ required: true, type: TopicReq }),
    ApiResponse({
      description: REQUEST_SUCCESSFUL,
      status: HttpStatus.ACCEPTED,
    }),
    ApiOperation({
      description: `
                  Handles topics by emitting them in real-time and optionally queueing them for persistence and vectorization. 
                  topics can be stored for future retrieval or processed for AI-based analysis using BullMQ.`,
    }),
  );
