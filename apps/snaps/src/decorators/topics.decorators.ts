import { TopicsReq } from '@ehildt/ckir-dtos';
import { applyDecorators, Get, ParseIntPipe, Query } from '@nestjs/common';
import { ApiQuery, ApiResponse } from '@nestjs/swagger';

const REQUEST_SUCCESSFUL = 'Message emitted successfully';

export const QueryHash = () => Query('hash');
export const QueryLimit = () =>
  Query('limit', new ParseIntPipe({ optional: true }));
export const QuerySkip = () =>
  Query('skip', new ParseIntPipe({ optional: true }));

export const ApiGetTopicsReq = () =>
  applyDecorators(
    Get(),
    ApiResponse({
      description: REQUEST_SUCCESSFUL,
      type: TopicsReq,
      isArray: true,
    }),
    ApiQuery({ name: 'limit', default: 10, required: false }),
    ApiQuery({ name: 'skip', default: 0, required: false }),
  );
