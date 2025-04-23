import { applyDecorators, Get, ParseIntPipe, Query } from '@nestjs/common';
import { ApiQuery, ApiResponse } from '@nestjs/swagger';

import { ThreadReq } from '@/dtos/thread-req.dto';

const REQUEST_SUCCESSFUL = 'Message emitted successfully';

export const QueryTopicId = () => Query('topicId');
export const QueryLimit = () => Query('limit', new ParseIntPipe({ optional: true }));
export const QuerySkip = () => Query('skip', new ParseIntPipe({ optional: true }));

export const GetThreadsReq = () =>
  applyDecorators(
    Get(),
    ApiResponse({
      description: REQUEST_SUCCESSFUL,
      type: ThreadReq,
      isArray: true,
    }),
    ApiQuery({ name: 'topicId' }),
    ApiQuery({ name: 'limit', default: 10, required: false }),
    ApiQuery({ name: 'skip', default: 0, required: false }),
  );
