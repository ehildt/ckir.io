import { applyDecorators, Get, ParseBoolPipe, ParseIntPipe, Query } from '@nestjs/common';
import { ApiQuery, ApiResponse } from '@nestjs/swagger';

import { MessageAttachmentReq } from '@/dtos/message-attachment.dto';
import { MessageReq } from '@/dtos/message-req.dto';

const REQUEST_SUCCESSFUL = 'Message emitted successfully';

export const QueryMessageId = () => Query('messageId');
export const QueryThreadId = () => Query('threadId');
export const QueryLimit = () => Query('limit', new ParseIntPipe({ optional: true }));
export const QuerySkip = () => Query('skip', new ParseIntPipe({ optional: true }));
export const QuerySelectFlags = () => Query('flags', new ParseBoolPipe({ optional: true }));
export const QuerySelectEmojis = () => Query('emojis', new ParseBoolPipe({ optional: true }));
export const QuerySelectAttachments = () => Query('attachments', new ParseBoolPipe({ optional: true }));

export const GetMessageAttachmentsReq = () =>
  applyDecorators(
    Get('attachments'),
    ApiQuery({ name: 'messageId' }),
    ApiQuery({ name: 'threadId' }),
    ApiQuery({ name: 'limit', default: 10, required: false }),
    ApiQuery({ name: 'skip', default: 0, required: false }),
    ApiResponse({ description: REQUEST_SUCCESSFUL, type: MessageAttachmentReq, isArray: true }),
  );

export const GetMessagesReq = () =>
  applyDecorators(
    Get(),
    ApiResponse({ description: REQUEST_SUCCESSFUL, type: MessageReq, isArray: true }),
    ApiQuery({ name: 'threadId' }),
    ApiQuery({ name: 'limit', default: 10, required: false }),
    ApiQuery({ name: 'skip', default: 0, required: false }),
    ApiQuery({ name: 'flags', default: true, required: false }),
    ApiQuery({ name: 'emojis', default: true, required: false }),
    ApiQuery({ name: 'attachments', default: true, required: false }),
  );
