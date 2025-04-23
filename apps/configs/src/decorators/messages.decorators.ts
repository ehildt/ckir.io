import { applyDecorators, HttpCode, HttpStatus, ParseEnumPipe, Post, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

import { GatewayMode } from '@/constants/gateway-mode.constants';
import { MessageReq } from '@/dtos/message-req.dto';

const REQUEST_SUCCESSFUL = 'Message emitted successfully';

export const QueryGatewayMode = () => Query('gateway', new ParseEnumPipe(GatewayMode, { optional: true }));

export const PostMessageReq = () =>
  applyDecorators(
    Post('messages'),
    HttpCode(202),
    ApiQuery({ name: 'gateway', enum: GatewayMode, required: false }),
    ApiBody({ required: true, type: MessageReq }),
    ApiResponse({
      description: REQUEST_SUCCESSFUL,
      status: HttpStatus.ACCEPTED,
    }),
    ApiOperation({
      description: `
              Handles messages by emitting them in real-time and optionally queueing them for persistence and vectorization. 
              Messages can be stored for future retrieval or processed for AI-based analysis using BullMQ.`,
    }),
  );
