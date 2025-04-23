import { MessageReq } from '@ckir.io/dtos';
import { applyDecorators, HttpCode, HttpStatus, ParseEnumPipe, Post, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

import { GatewayMode } from '@/constants/gateway-mode.constants';

const REQUEST_SUCCESSFUL = 'Message emitted successfully';

export const QueryGatewayMode = () => Query('gateway', new ParseEnumPipe(GatewayMode, { optional: true }));

export const PostMessageReq = () =>
  applyDecorators(
    Post(),
    HttpCode(202),
    ApiQuery({
      name: 'mode',
      enum: GatewayMode,
      required: false,
      description: `
      Persist saves the message, Vectorize generates an embedding and stores it with the message payload, 
      and leaving empty (--) only emits the message through Socket.IO.
      `,
    }),
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
