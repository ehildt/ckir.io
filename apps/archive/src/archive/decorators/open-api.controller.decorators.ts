import { applyDecorators } from '@nestjs/common';
import { ApiCreatedResponse, ApiResponse } from '@nestjs/swagger';

import { ChatMessageReq } from '../dtos/chat-message.dto.req';
import { MessageUpsert } from './open-api.method.decorators';

const REQUEST_SUCCESSFUL = 'request successful';

export function OpenApi_UpsertChatMessage() {
  return applyDecorators(MessageUpsert(), ApiCreatedResponse({ description: REQUEST_SUCCESSFUL }));
}

export function OpenApi_GetChatMessages() {
  return applyDecorators(ApiResponse({ description: REQUEST_SUCCESSFUL, type: ChatMessageReq }));
}
