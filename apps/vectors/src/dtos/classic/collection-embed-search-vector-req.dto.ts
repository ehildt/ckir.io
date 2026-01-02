import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsNumber,
  IsObject,
  IsOptional,
} from 'class-validator';

export class CollectionEmbedSearchVectorReq {
  @IsOptional()
  @IsObject()
  @ApiPropertyOptional({
    description: 'Filters applied to the payload of matched vectors',
    example: { category: 'cats', lang: 'meow' },
  })
  readonly filters?: Record<string, unknown>;

  @IsArray()
  @ArrayMinSize(1)
  @IsNumber({}, { each: true })
  @ApiProperty({
    type: [Number],
    description: 'Embedding vector used for similarity search',
    example: [0.12, -0.44, 0.98],
  })
  readonly vector: Array<number>;
}
