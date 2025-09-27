import { PostsAttachmentReq, PostsReq } from '@ckir.io/dtos';
import { applyDecorators, Get, ParseBoolPipe, ParseIntPipe, Post, Query } from '@nestjs/common';
import { ApiBody, ApiQuery, ApiResponse } from '@nestjs/swagger';

const REQUEST_SUCCESSFUL = 'Posts emitted successfully';

export const QueryPostId = () => Query('postId');
export const QueryHash = () => Query('hash');
export const QueryThreadId = () => Query('threadId');
export const QueryLimit = () => Query('limit', new ParseIntPipe({ optional: true }));
export const QuerySkip = () => Query('skip', new ParseIntPipe({ optional: true }));
export const QuerySelectFlags = () => Query('flags', new ParseBoolPipe({ optional: true }));
export const QuerySelectEmojis = () => Query('emojis', new ParseBoolPipe({ optional: true }));
export const QuerySelectAttachments = () => Query('attachments', new ParseBoolPipe({ optional: true }));

export const ApiPostFindOneAndUpdate = () =>
  applyDecorators(
    Post(),
    ApiBody({
      type: PostsReq,
      required: true,
    }),
    ApiResponse({
      type: String,
    }),
  );

export const ApiGetPostsAttachmentsReq = () =>
  applyDecorators(
    Get('attachments'),
    ApiQuery({ name: 'postId' }),
    ApiQuery({ name: 'threadId' }),
    ApiQuery({ name: 'limit', default: 10, required: false }),
    ApiQuery({ name: 'skip', default: 0, required: false }),
    ApiResponse({
      description: REQUEST_SUCCESSFUL,
      type: PostsAttachmentReq,
      isArray: true,
    }),
  );

export const ApiGetPostsReq = () =>
  applyDecorators(
    Get(),
    ApiResponse({
      description: REQUEST_SUCCESSFUL,
      type: PostsReq,
      isArray: true,
    }),
    ApiQuery({ name: 'threadId' }),
    ApiQuery({ name: 'limit', default: 10, required: false }),
    ApiQuery({ name: 'skip', default: 0, required: false }),
    ApiQuery({ name: 'flags', default: true, required: false }),
    ApiQuery({ name: 'emojis', default: true, required: false }),
    ApiQuery({ name: 'attachments', default: true, required: false }),
  );
