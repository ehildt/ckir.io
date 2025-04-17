import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class MessageFlagReq {
  @IsString()
  @ApiProperty({
    default: 'MEME',
    required: true,
    description: 'The flag label (e.g., HATE_SPEECH, PROPAGANDA, MEME, etc.) applied to the message.',
  })
  name: string;

  @IsNumber()
  @ApiProperty({
    default: 0,
    required: true,
    description: 'The number of users who agree that this flag label appropriately describes the message.',
  })
  agree: number;

  @IsNumber()
  @ApiProperty({
    default: 0,
    required: true,
    description: 'The number of users who disagree that this flag label appropriately describes the message.',
  })
  disagree: number;
}
