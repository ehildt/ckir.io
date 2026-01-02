import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class CollectionEmbedDeleteReq {
  @IsArray()
  @ApiProperty({
    type: [String],
    example: ['id_1', 'id_2', 'id_n'],
  })
  pointIds: Array<string>;
}
