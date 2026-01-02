import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export class CollectionEmbedSearchTextReq {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description:
      'The text content that will be segmented and used for similarity search',
    example: "Mom's cookies are the best!",
  })
  text: string;

  @IsOptional()
  @IsObject()
  @ApiPropertyOptional({
    description: 'Filters applied to the payload of matched vectors',
    example: {
      category: 'cookies',
    },
  })
  filters?: Record<string, unknown>;
}
