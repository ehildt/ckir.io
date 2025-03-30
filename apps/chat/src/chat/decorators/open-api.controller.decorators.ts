import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { ChatMessageReq } from '../dtos/chat-message.dto.req';

const REQUEST_SUCCESSFUL = 'Chat message emitted successfully.';

export function OpenApi_Chat() {
  return applyDecorators(
    ApiBody({ required: true, type: ChatMessageReq }),
    ApiResponse({ description: REQUEST_SUCCESSFUL, status: HttpStatus.ACCEPTED }),
    ApiOperation({
      description: `
        Handles chat messages by emitting them in real-time and optionally queueing them for persistence and vectorization. 
        Messages can be stored for future retrieval or processed for AI-based analysis using BullMQ.`,
    }),
  );
}
