import { applyDecorators, Get, ParseIntPipe, Query } from '@nestjs/common';
import { ApiQuery, ApiResponse } from '@nestjs/swagger';

import { TopicReq } from '@/dtos/topic-req.dto';

const REQUEST_SUCCESSFUL = 'Message emitted successfully';

export const QueryLimit = () => Query('limit', new ParseIntPipe({ optional: true }));
export const QuerySkip = () => Query('skip', new ParseIntPipe({ optional: true }));

export const GetTopicsReq = () =>
  applyDecorators(
    Get(),
    ApiResponse({
      description: REQUEST_SUCCESSFUL,
      type: TopicReq,
      isArray: true,
    }),
    ApiQuery({ name: 'limit', default: 10, required: false }),
    ApiQuery({ name: 'skip', default: 0, required: false }),
  );
