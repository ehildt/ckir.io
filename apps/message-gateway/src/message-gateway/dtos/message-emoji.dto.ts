import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class MessageEmojiReq {
  @IsString()
  @ApiProperty({
    default: 'laugh',
    required: true,
    description: 'The name of the emoji reaction applied to this message.',
  })
  name: string;

  @IsNumber()
  @ApiProperty({
    default: 0,
    required: true,
    description: 'Number of users who reacted with this emoji.',
  })
  count: number;
}
