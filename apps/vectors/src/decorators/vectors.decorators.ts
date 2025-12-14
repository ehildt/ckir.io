import { QdrantEmbeddingSize } from '@ehildt/ckir-qdrant';
import {
  Param,
  ParseEnumPipe,
  ParseFloatPipe,
  ParseIntPipe,
  Query,
} from '@nestjs/common';

const parseIntPipe = new ParseIntPipe({ optional: true });
const parseFloatPipe = new ParseFloatPipe({ optional: true });
const parseEmbeddingSizePipe = new ParseEnumPipe(QdrantEmbeddingSize);
const parseDistancePipe = new ParseEnumPipe([
  'Cosine',
  'Euclid',
  'Dot',
  'Manhattan',
]);

export const QueryVectorSize = () =>
  Query('vectorSize', parseEmbeddingSizePipe);

export const QueryDistance = () => Query('distance', parseDistancePipe);
export const QueryScore = () => Query('score', parseFloatPipe);
export const QueryLimit = () => Query('limit', parseIntPipe);
export const QueryOffset = () => Query('offset', parseIntPipe);
export const ParamCollection = () => Param('collection');
