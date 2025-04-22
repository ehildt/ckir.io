import { applyDecorators, Get, HttpCode, HttpStatus, ParseBoolPipe, ParseIntPipe, Post, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

import { GatewayMode } from '@/constants/gateway-mode.constants';
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

export const PostMessageReq = () =>
  applyDecorators(
    Post('messages'),
    HttpCode(202),
    ApiQuery({ name: 'gateway', enum: [GatewayMode.PERSIST], required: false }),
    ApiBody({ required: true, type: MessageReq }),
    ApiResponse({ description: REQUEST_SUCCESSFUL, status: HttpStatus.ACCEPTED }),
    ApiOperation({
      description: 'Handles chat messages by queueing them for persistence',
    }),
  );

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
