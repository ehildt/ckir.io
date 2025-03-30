import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class ChatMessageArgs {
  @IsBoolean()
  @ApiProperty({
    default: false,
    required: false,
    description: 'Whether the chat message should be vectorized.',
  })
  vectorize: boolean;

  @IsBoolean()
  @ApiProperty({
    required: false,
    default: false,
    description: 'Whether the chat message should be persisted.',
  })
  persist: boolean;

  @IsBoolean()
  @ApiProperty({
    required: false,
    default: false,
    description: 'Whether the user wants to chat with the ai.',
  })
  ai: boolean;
}
