import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class MatchPayload {
  @ApiPropertyOptional({
    description: 'Identifier of the source content (payload).',
    example: 'abcd-efgh-ijkl-mnop',
  })
  @IsOptional()
  @IsString()
  id?: string;
}

export class Match {
  @ApiProperty({
    description: 'Unique identifier of the match/vector in Qdrant.',
    example: '96cb8554-90d4-4384-a3db-cfadbf9c05ea',
  })
  @IsString()
  id: string;

  @ApiProperty({
    description: 'Qdrant internal version of the point/vector.',
    example: 1,
  })
  @IsNumber()
  version: number;

  @ApiProperty({
    description: 'Similarity score for this match.',
    example: 0.77469635,
  })
  @IsNumber()
  score: number;

  @ApiPropertyOptional({
    type: MatchPayload,
    description: 'Optional payload data associated with this match.',
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => MatchPayload)
  payload?: MatchPayload;
}

export class AggregatedBucket {
  @ApiProperty({
    description: 'Unique set of payload IDs present in this bucket.',
    example: ['abcd-efgh-ijkl-mnop'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  aggregatedPayloadIds: Array<string>;

  @ApiProperty({
    description: 'Matches belonging to this bucket.',
    type: [Match],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Match)
  matches: Array<Match>;
}
