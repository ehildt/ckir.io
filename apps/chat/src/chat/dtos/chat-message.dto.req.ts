import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsObject, IsOptional, IsString, MaxLength, ValidateNested } from 'class-validator';

import { ChatMessageArgs } from './chat-message-args.dto';
import { ChatMessageAttachment } from './chat-message-attachment.dto';
import { ChatMessageParticipant } from './chat-message-participant.dto';
import { ChatMessageThread } from './chat-message-thread.dto';
import { ChatMessageTopic } from './chat-message-topic.dto';

export class ChatMessageReq {
  @IsString()
  @ApiProperty({ example: 'user8f3x0fets4ip1v7f95hz9x00teic', description: 'The cuid of the publisher' })
  publisherId: string;

  @IsString()
  @MaxLength(1000)
  @ApiProperty({
    example: 'something meaningful, deep or just insane',
    description: 'The actual message',
    maxLength: 5000,
  })
  message: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'clkt4f3x0000s4xw1v7f95hz9x000002',
    description: 'A reference to the quoted message (cuid)',
    required: false,
  })
  refQuote?: string;

  @IsObject()
  @Type(() => ChatMessageTopic)
  @ApiProperty({
    description: 'The topic',
    type: ChatMessageTopic,
  })
  topic: ChatMessageTopic;

  @IsOptional()
  @IsObject()
  @Type(() => ChatMessageThread)
  @ApiProperty({
    description: 'The topic',
    type: ChatMessageThread,
    required: false,
  })
  thread?: ChatMessageThread;

  @IsOptional()
  @IsString({ each: true })
  @ApiProperty({
    isArray: true,
    required: false,
    description: 'A list of emoji cuids',
    example: ['emot4f3x0000s4xp1v7f95hz9x00te02'],
  })
  refEmojis?: Array<string>;

  @IsOptional()
  @IsString({ each: true })
  @ApiProperty({
    isArray: true,
    required: false,
    description: 'A list of flag cuids',
    example: ['flat4f3x0000s4xp1v7fi5hz9x00te0g'],
  })
  refFlags?: Array<string>;

  @IsOptional()
  @ApiProperty({
    required: false,
    isArray: true,
    type: ChatMessageParticipant,
  })
  @Type(() => ChatMessageParticipant)
  @ValidateNested({ each: true })
  refParticipants?: Array<ChatMessageParticipant>;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ChatMessageAttachment)
  @ApiProperty({ type: ChatMessageAttachment, isArray: true, required: false })
  attachments?: Array<ChatMessageAttachment>;

  @IsOptional()
  @Type(() => ChatMessageArgs)
  @ApiProperty({ type: ChatMessageArgs, required: false })
  args?: ChatMessageArgs;
}
