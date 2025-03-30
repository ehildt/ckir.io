import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation } from '@nestjs/swagger';

import { ChatMessageReq } from '../dtos/chat-message.dto.req';

const REQUEST_SUCCESSFUL = 'Chat message emitted successfully.';

export function OpenApi_Chat() {
  return applyDecorators(
    ApiBody({ required: true, type: ChatMessageReq }),
    ApiOkResponse({ description: REQUEST_SUCCESSFUL }),
    ApiOperation({
      description: `
        Handles chat messages by emitting them in real-time and optionally queueing them for persistence and vectorization. 
        Messages can be stored for future retrieval or processed for AI-based analysis using BullMQ.`,
    }),
  );
}
