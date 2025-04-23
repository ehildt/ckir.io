import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsOptional, IsString, MaxLength, ValidateNested } from 'class-validator';

import { MessageMode } from './message.constants';
import { MessageAttachmentReq } from './message-attachment.dto';
import { MessageEmojiReq } from './message-emoji.dto';
import { MessageFlagReq } from './message-flag.dto';

/**
 * Represents a message request in the system.\
 * This DTO is used to handle the incoming data for creating or updating messages.\
 * It includes fields for the message sender, recipient, content, and associated metadata such as emojis, flags, and attachments.
 */
export class MessageReq {
  /**
   * Unique identifier of the message publisher (sender of the message).\
   * This field is mandatory and identifies who sent the message.
   *
   * @example 'usr_4a1f23b7c2d84e57b12c5f9a'
   */
  @IsString()
  @ApiProperty({
    example: 'usr_4a1f23b7c2d84e57b12c5f9a',
    description: 'Unique identifier of the message publisher (i.e., the sender of the message).',
  })
  publisherId: string;

  /**
   * Unique identifier of the topic the message belongs to.\
   * Used to group messages under a specific topic. Optional, but provided for topic-based discussions.
   *
   * @example 'topic_983bc3f1a9e940efa21a1c48'
   */
  @IsString()
  @ApiProperty({
    required: false,
    example: 'topic_983bc3f1a9e940efa21a1c48',
    description: 'A unique topic identifier. Used as part of the chatId to group messages under a specific topic.',
  })
  topicId: string;

  /**
   * Unique identifier of the thread the message belongs to.\
   * Used to associate the message with a specific thread. Optional for messages not tied to a thread.
   *
   * @example 'thread_b201ee3f43d74cd4a6e4dd84'
   */
  @IsString()
  @ApiProperty({
    required: false,
    example: 'thread_b201ee3f43d74cd4a6e4dd84',
    description:
      'A unique thread identifier. Used as part of the chatId to associate the message with a specific thread.',
  })
  threadId: string;

  /**
   * The main content of the message. Limited to 5000 characters.\
   * This field contains the textual message sent by the user.
   *
   * @example 'Hey, did you check the new design doc I shared earlier?'
   */
  @IsString()
  @MaxLength(5000)
  @ApiProperty({
    example: 'Hey, did you check the new design doc I shared earlier?',
    description: 'A text, limited to 5000 characters.',
    maxLength: 5000,
  })
  text: string;

  /**
   * The unique identifier of the message recipient (for private or direct messages).\
   * Optional field; required only for messages intended for specific recipients (not public messages).
   *
   * @example 'usr_5de8c20a4d134c1d9d45f13a'
   */
  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    example: 'usr_5de8c20a4d134c1d9d45f13a',
    description: 'Unique identifier of the message recipient. Required for private/direct messages.',
  })
  recipientId?: string;

  /**
   * The unique identifier of a quoted message, if the current message is quoting another.\
   * This allows for threaded or quoted discussions.
   *
   * @example 'msg_8af23b761ee04bb392a4f9dc'
   */
  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    example: 'msg_8af23b761ee04bb392a4f9dc',
    description: 'Optional unique identifier of a quoted message, if the current message is quoting another.',
  })
  quoteId?: string;

  /**
   * The operational mode of the message, defined by a predefined enumeration.\
   * This can indicate whether the message is public, private, deleted, etc.\
   */
  @ApiProperty({
    enum: MessageMode,
    required: false,
    description: `The operational mode of the message, defined by a predefined enumeration.
    This can indicate whether the message is public, private, deleted, etc.
    `,
  })
  @IsOptional()
  @IsEnum(MessageMode)
  mode?: MessageMode;

  /**
   * List of emojis associated with the message (e.g., reactions).\
   * Optional field; emojis provide a way for users to react to messages.
   *
   * @example [{ "label": "laugh", "count": 5 }]
   */
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

  /**
   * List of flags applied to the message, such as moderation tags or other classifications.\
   * Optional field; used for flagging messages with certain categories like spam, hate speech, etc.
   *
   * @example [{ "name": "SPAM", "agreeCount": 3, "disagreeCount": 0 }]
   */
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

  /**
   * List of file attachments included with the message (e.g., images, documents).\
   * Optional field; used to attach files to the message.
   *
   * @example [{ "refId": "file123", "filename": "document.pdf", "url": "https://example.com/document.pdf" }]
   */
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
