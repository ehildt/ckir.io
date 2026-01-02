import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export class CollectionEmbedUpsertReq {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The text content to create an embedding from.',
    example: 'Good old times, where cookies were just that—cookies.',
  })
  text: string;

  @IsObject()
  @IsOptional()
  @ApiPropertyOptional({
    type: Object,
    description: 'The payload to store next to the text',
    example: { id: 'abcd-efgh-ijkl-mnop', category: 'cookies' },
  })
  payload?: Record<string | number, any>;
}
