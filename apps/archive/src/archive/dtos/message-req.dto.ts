import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude, Type } from 'class-transformer';
import { IsEnum, IsOptional, IsString, MaxLength, ValidateIf, ValidateNested } from 'class-validator';

import { MessageMode } from '../constants /message-req.constants';
import { MessageAttachmentReq } from './message-attachment.dto';
import { MessageEmojiReq } from './message-emoji.dto';
import { MessageFlagReq } from './message-flag.dto';

export class MessageReq {
  @IsString()
  @ApiProperty({
    example: 'usr_4a1f23b7c2d84e57b12c5f9a',
    description: 'Unique identifier of the message publisher (i.e., the sender of the message).',
  })
  publisherId: string;

  @IsString()
  @ApiProperty({
    required: false,
    example: 'topic_983bc3f1a9e940efa21a1c48',
    description: 'A unique topic identifier. Used as part of the chatId to group messages under a specific topic.',
  })
  topicId: string;

  @IsString()
  @ApiProperty({
    required: false,
    example: 'thread_b201ee3f43d74cd4a6e4dd84',
    description:
      'A unique thread identifier. Used as part of the chatId to associate the message with a specific thread.',
  })
  threadId: string;

  @IsString()
  @MaxLength(5000)
  @ApiProperty({
    example: 'Hey, did you check the new design doc I shared earlier?',
    description: 'A text, limited to 5000 characters.',
    maxLength: 5000,
  })
  text: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    example: 'usr_5de8c20a4d134c1d9d45f13a',
    description: 'Unique identifier of the message recipient. Required for private/direct messages.',
  })
  recipientId?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    example: 'msg_8af23b761ee04bb392a4f9dc',
    description: 'Optional unique identifier of a quoted message, if the current message is quoting another.',
  })
  quoteId?: string;

  @IsEnum(MessageMode)
  @ApiHideProperty()
  @Exclude()
  @ValidateIf((o) => o.mode !== undefined)
  mode?: MessageMode;

  @IsOptional()
  @Type(() => MessageEmojiReq)
  @ValidateNested({ each: true })
  @ApiProperty({
    isArray: true,
    required: false,
    type: MessageEmojiReq,
    description: 'List of emojis associated with the message (e.g., reactions).',
  })
  emojis?: Array<MessageEmojiReq>;

  @IsOptional()
  @Type(() => MessageFlagReq)
  @ValidateNested({ each: true })
  @ApiProperty({
    isArray: true,
    required: false,
    type: MessageFlagReq,
    description: 'List of flags applied to the message, such as edits or moderation tags.',
  })
  flags?: Array<MessageFlagReq>;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => MessageAttachmentReq)
  @ApiProperty({
    isArray: true,
    required: false,
    type: MessageAttachmentReq,
    description: 'List of file attachments included with the message (e.g., images, documents).',
  })
  attachments?: Array<MessageAttachmentReq>;
}
