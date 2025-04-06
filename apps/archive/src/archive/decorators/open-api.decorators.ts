import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiCreatedResponse, ApiResponse } from '@nestjs/swagger';

import { MessageAttachmentReq } from '../dtos/message-attachment.dto';
import { MessageReq } from '../dtos/message-req.dto';

const REQUEST_SUCCESSFUL = 'request successful';

export function OpenApi_UpsertChatMessage() {
  return applyDecorators(MessageUpsert(), ApiCreatedResponse({ description: REQUEST_SUCCESSFUL }));
}

export function OpenApi_GetChatMessages() {
  return applyDecorators(ApiResponse({ description: REQUEST_SUCCESSFUL, type: MessageReq, isArray: true }));
}

export function OpenApi_GetChatMessageAttachments() {
  return applyDecorators(ApiResponse({ description: REQUEST_SUCCESSFUL, type: MessageAttachmentReq, isArray: true }));
}

export const MessageUpsert = () =>
  ApiBody({
    required: true,
    type: MessageReq,
  });
