import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

import { ThreadsMode } from './threads.constants';

export class ThreadsReq {
  /**
   * Unique identifier of the topic publisher (sender of the thread).\
   * This field is mandatory and identifies who sent the topic.
   *
   * @example 'usr_4a1f23b7c2d84e57b12c5f9a'
   */
  @IsString()
  @ApiProperty({
    example: 'usr_4a1f23b7c2d84e57b12c5f9a',
    description:
      'Unique identifier of the topic publisher (i.e., the sender of the topic).',
  })
  publisherId: string;

  /**
   * The title of the thread.
   * This serves as the primary identifier for the thread.
   *
   * @example "Strawberry Flavor"
   */
  @IsString()
  @ApiProperty({
    example: 'Strawberry Flavor',
    description: 'The thread title',
  })
  title: string;

  /**
   * A short description of the thread's purpose or scope.\
   * This field provides additional context or details about the thread.
   *
   * @example "This thread is for discussing cookies, recipes, and all things baked."
   */
  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    description: "A short description of the thread's purpose or scope.",
    example:
      'This thread is for discussing cookies, recipes, and all things baked.',
  })
  description?: string;

  /**
   * The operational mode of the thread, which can be one of the predefined types (e.g., open or closed).\
   * This helps to define how the thread behaves (e.g., read-only, open for new posts, etc.).
   *
   * @example "RESTRICTED"
   */
  @IsOptional()
  @IsString()
  @ApiProperty({
    enum: ThreadsMode,
    required: false,
    description:
      'The operational mode of the thread (e.g., RESTRICTED, DELETED)',
    default: undefined,
  })
  mode?: ThreadsMode;

  /**
   * The reference ID of the topic this thread belongs to.\
   * It links the thread to its parent topic.
   *
   * @example "topic123"
   */
  @IsString()
  @ApiProperty({
    example: 'topic123',
    description: 'The reference to the topic this thread belongs to.',
  })
  topicId: string;

  /**
   * The timestamp of the most recent activity in the thread.\
   * This helps to track when the thread was last updated or interacted with.
   *
   * @example "2023-08-17T12:34:56Z"
   */
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @ApiProperty({
    required: false,
    description: 'The timestamp of the most recent activity in this thread.',
    example: new Date('2023-08-17T12:34:56Z'),
  })
  lastActivityAt?: Date;

  /**
   * The total number of replies or posts in this thread.\
   * This gives an idea of the thread's engagement level.
   *
   * @example 15
   */
  @IsOptional()
  @IsNumber()
  @ApiProperty({
    example: 15,
    description:
      'The total number of replies or posts associated with this thread.',
    required: false,
  })
  replyCount?: number;

  /**
   * The total number of participants in the thread.\
   * This counts the unique users who have contributed to the thread.
   *
   * @example 8
   */
  @IsOptional()
  @IsNumber()
  @ApiProperty({
    example: 8,
    description:
      'The total number of participants who have contributed to this thread.',
    required: false,
  })
  participantCount?: number;

  /**
   * A list of tags or categories associated with the thread.\
   * This can be used to categorize or group threads.
   *
   * @example ["cookies", "desserts", "baking"]
   */
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ApiProperty({
    example: ['cookies', 'desserts', 'baking'],
    description: 'A list of tags or categories associated with this thread.',
    required: false,
  })
  tags?: Array<string>;
}
