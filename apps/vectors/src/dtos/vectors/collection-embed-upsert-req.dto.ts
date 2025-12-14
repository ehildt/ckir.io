import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export class CollectionEmbedUpsertReq {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'The text content to create an embedding from.',
  })
  content: string;

  @IsObject()
  @IsOptional()
  @ApiPropertyOptional({
    type: Object,
    description: 'The payload to store next to the content',
  })
  payload?: Record<string | number, any>;
}
