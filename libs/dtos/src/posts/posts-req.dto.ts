import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsOptional, IsString, MaxLength, ValidateNested } from 'class-validator';

import { PostsMode } from './posts.constants';
import { PostsAttachmentReq } from './posts-attachment.dto';
import { PostsEmojiReq } from './posts-emoji.dto';
import { PostsFlagReq } from './posts-flag.dto';

/**
 * Represents a post request in the system.\
 * This DTO is used to handle the incoming data for creating or updating posts.\
 * It includes fields for the post sender, recipient, content, and associated metadata such as emojis, flags, and attachments.
 */
export class PostsReq {
  /**
   * Unique identifier of the post publisher (sender of the post).\
   * This field is mandatory and identifies who sent the post.
   *
   * @example 'usr_4a1f23b7c2d84e57b12c5f9a'
   */
  @IsString()
  @ApiProperty({
    example: 'usr_4a1f23b7c2d84e57b12c5f9a',
    description: 'Unique identifier of the post publisher (i.e., the sender of the post).',
  })
  publisherId: string;

  /**
   * Unique identifier of the topic the post belongs to.\
   * Used to group posts under a specific topic. Optional, but provided for topic-based discussions.
   *
   * @example 'topic_983bc3f1a9e940efa21a1c48'
   */
  @IsString()
  @ApiProperty({
    required: false,
    example: 'topic_983bc3f1a9e940efa21a1c48',
    description: 'A unique topic identifier. Used as part of the chatId to group posts under a specific topic.',
  })
  topicId: string;

  /**
   * Unique identifier of the thread the post belongs to.\
   * Used to associate the post with a specific thread. Optional for posts not tied to a thread.
   *
   * @example 'thread_b201ee3f43d74cd4a6e4dd84'
   */
  @IsString()
  @ApiProperty({
    required: false,
    example: 'thread_b201ee3f43d74cd4a6e4dd84',
    description: 'A unique thread identifier. Used as part of the chatId to associate the post with a specific thread.',
  })
  threadId: string;

  /**
   * The main content of the post. Limited to 5000 characters.\
   * This field contains the textual post sent by the user.
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
   * The unique identifier of the post recipient (for private or direct posts).\
   * Optional field; required only for posts intended for specific recipients (not public posts).
   *
   * @example 'usr_5de8c20a4d134c1d9d45f13a'
   */
  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    example: 'usr_5de8c20a4d134c1d9d45f13a',
    description: 'Unique identifier of the post recipient. Required for private/direct posts.',
  })
  recipientId?: string;

  /**
   * The unique identifier of a quoted post, if the current post is quoting another.\
   * This allows for threaded or quoted discussions.
   *
   * @example 'msg_8af23b761ee04bb392a4f9dc'
   */
  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    example: 'msg_8af23b761ee04bb392a4f9dc',
    description: 'Optional unique identifier of a quoted post, if the current post is quoting another.',
  })
  quoteId?: string;

  /**
   * The operational mode of the post, defined by a predefined enumeration.\
   * This can indicate whether the post is public, private, deleted, etc.\
   */
  @ApiProperty({
    enum: PostsMode,
    required: false,
    description: `The operational mode of the post, defined by a predefined enumeration.
    This can indicate whether the post is public, private, deleted, etc.
    `,
  })
  @IsOptional()
  @IsEnum(PostsMode)
  mode?: PostsMode;

  /**
   * List of emojis associated with the post (e.g., reactions).\
   * Optional field; emojis provide a way for users to react to posts.
   *
   * @example [{ "label": "laugh", "count": 5 }]
   */
  @IsOptional()
  @Type(() => PostsEmojiReq)
  @ValidateNested({ each: true })
  @ApiProperty({
    isArray: true,
    required: false,
    type: PostsEmojiReq,
    description: 'List of emojis associated with the post (e.g., reactions).',
  })
  emojis?: Array<PostsEmojiReq>;

  /**
   * List of flags applied to the post, such as moderation tags or other classifications.\
   * Optional field; used for flagging posts with certain categories like spam, hate speech, etc.
   *
   * @example [{ "name": "SPAM", "agreeCount": 3, "disagreeCount": 0 }]
   */
  @IsOptional()
  @Type(() => PostsFlagReq)
  @ValidateNested({ each: true })
  @ApiProperty({
    isArray: true,
    required: false,
    type: PostsFlagReq,
    description: 'List of flags applied to the post, such as edits or moderation tags.',
  })
  flags?: Array<PostsFlagReq>;

  /**
   * List of file attachments included with the post (e.g., images, documents).\
   * Optional field; used to attach files to the post.
   *
   * @example [{ "refId": "file123", "filename": "document.pdf", "url": "https://example.com/document.pdf" }]
   */
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => PostsAttachmentReq)
  @ApiProperty({
    isArray: true,
    required: false,
    type: PostsAttachmentReq,
    description: 'List of file attachments included with the post (e.g., images, documents).',
  })
  attachments?: Array<PostsAttachmentReq>;
}
