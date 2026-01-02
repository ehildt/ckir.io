import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsString } from 'class-validator';

class Collection {
  @ApiProperty()
  @IsString()
  name: string;
}

export class McpCollectionCreateRes {
  @ApiProperty({
    type: Collection,
    isArray: true,
  })
  @IsArray()
  @Type(() => Collection)
  collections: Array<Collection>;
}
