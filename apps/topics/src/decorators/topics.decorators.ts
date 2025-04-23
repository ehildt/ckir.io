import { TopicReq } from '@ckir.io/dtos';
import { applyDecorators, HttpCode, HttpStatus, ParseEnumPipe, Post, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

import { GatewayMode } from '@/constants/gateway-mode.constants';

const REQUEST_SUCCESSFUL = 'Message emitted successfully';

export const QueryGatewayMode = () => Query('gateway', new ParseEnumPipe(GatewayMode, { optional: true }));

export const PostTopicsReq = () =>
  applyDecorators(
    Post(),
    HttpCode(202),
    ApiQuery({
      name: 'mode',
      enum: GatewayMode,
      required: false,
      description: `
      Persist saves the topic, Vectorize generates an embedding and stores it with the topic payload, 
      and leaving empty (--) only emits the topic through Socket.IO.
      `,
    }),
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
