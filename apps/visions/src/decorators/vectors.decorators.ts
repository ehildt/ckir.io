import { QdrantEmbeddingSize } from '@ckir.io/qdrant';
import {
  createParamDecorator,
  ExecutionContext,
  Param,
  ParseEnumPipe,
  ParseFloatPipe,
  ParseIntPipe,
  Query,
} from '@nestjs/common';

export enum QueryFilterTypeEnum {
  Topic = 'topic',
  Thread = 'thread',
  Post = 'post',
}

const parseIntPipe = new ParseIntPipe({ optional: true });
const parseFloatPipe = new ParseFloatPipe({ optional: true });
const parseEmbeddingSizePipe = new ParseEnumPipe(QdrantEmbeddingSize);
const parseDistancePipe = new ParseEnumPipe(['Cosine', 'Euclid', 'Dot', 'Manhattan']);

export const QueryVectorSize = () => Query('vectorSize', parseEmbeddingSizePipe);

export const QueryDistance = () => Query('distance', parseDistancePipe);
export const QueryScore = () => Query('score', parseFloatPipe);
export const QueryLimit = () => Query('limit', parseIntPipe);
export const QueryOffset = () => Query('offset', parseIntPipe);
export const ParamCollection = () => Param('collection');

export const QueryFilterType = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): QueryFilterTypeEnum | QueryFilterTypeEnum[] => {
    const request = ctx.switchToHttp().getRequest();
    const type = request.query.type as QueryFilterTypeEnum | undefined;
    return type ? type : [QueryFilterTypeEnum.Topic, QueryFilterTypeEnum.Thread, QueryFilterTypeEnum.Post];
  },
);
