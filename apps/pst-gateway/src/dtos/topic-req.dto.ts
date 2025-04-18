import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

import { TopicMode } from '@/constants/topic.constants';

/**
 * Data Transfer Object (DTO) for creating or updating a discussion topic.\
 * This DTO includes topic metadata, including title, description, tags, and more.
 */
export class TopicReq {
  /**
   * Unique identifier of the topic publisher (sender of the topic).\
   * This field is mandatory and identifies who sent the topic.
   *
   * @example 'usr_4a1f23b7c2d84e57b12c5f9a'
   */
  @IsString()
  @ApiProperty({
    example: 'usr_4a1f23b7c2d84e57b12c5f9a',
    description: 'Unique identifier of the topic publisher (i.e., the sender of the topic).',
  })
  publisherId: string;
  /**
   * The title of the topic.\
   * This is the primary identifier for the topic.
   *
   * @example "Cookies"
   */
  @IsString()
  @ApiProperty({
    example: 'Cookies',
    description: 'The topic title',
  })
  title: string;

  /**
   * The operational mode of the topic, which can be one of the predefined types (e.g., open or closed).\
   * This helps to define how the topic behaves (e.g., read-only, open for new posts, etc.).
   *
   * @example "RESTRICTED"
   */
  @IsOptional()
  @IsString()
  @ApiProperty({
    enum: TopicMode,
    required: false,
    description: 'The operational mode of the topic (e.g., RESTRICTED, DELETED)',
    default: undefined,
  })
  mode?: TopicMode;

  /**
   * A short description of the topic’s purpose or scope.\
   * This field provides additional context or details about the topic.
   *
   * @example "This topic is for discussing cookies, recipes, and all things baked."
   */
  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    description: 'A short description of the topic’s purpose or scope.',
    example: 'This topic is for discussing cookies, recipes, and all things baked.',
  })
  description?: string;

  /**
   * The reference ID of the user who created the topic.\
   * This field links to the user who initiated the topic.
   *
   * @example "user123"
   */
  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    description: 'Reference to the user who created the topic.',
    example: 'user123',
  })
  createdBy?: string;

  /**
   * The timestamp of the most recent activity (e.g. new thread or reply) in this topic.\
   * This helps to track the latest update in the topic.
   *
   * @example "2023-08-17T12:34:56Z"
   */
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @ApiProperty({
    required: false,
    description: 'The timestamp of the most recent activity in this topic.',
    example: new Date('2023-08-17T12:34:56Z'),
  })
  lastActivityAt?: Date;

  /**
   * The total number of threads associated with this topic, including both active and deleted threads.\
   * This helps to track the overall thread count for the topic.
   *
   * @example 10
   */
  @IsOptional()
  @IsNumber()
  @ApiProperty({
    required: false,
    description: 'The total number of threads for this topic.',
    example: 10,
    default: 0,
  })
  threadCount?: number;

  /**
   * The number of threads under this topic that have been marked as deleted.\
   * This helps to track the number of threads that are no longer visible.
   *
   * @example 2
   */
  @IsOptional()
  @IsNumber()
  @ApiProperty({
    required: false,
    description: 'The number of threads marked as deleted.',
    example: 2,
    default: 0,
  })
  deletedThreadCount?: number;

  /**
   * The total number of unique users who have ever contributed to threads in this topic,\
   * including those whose threads are now deleted.
   *
   * @example 15
   */
  @IsOptional()
  @IsNumber()
  @ApiProperty({
    required: false,
    description: 'The total number of unique participants who have contributed to this topic.',
    example: 15,
    default: 0,
  })
  participantCount?: number;

  /**
   * The number of unique users currently participating in non-deleted threads\
   * under this topic. Excludes users whose only contributions were deleted threads.
   *
   * @example 12
   */
  @IsOptional()
  @IsNumber()
  @ApiProperty({
    required: false,
    description: 'The number of active participants in this topic.',
    example: 12,
    default: 0,
  })
  activeParticipantCount?: number;

  /**
   * A list of tags or categories associated with this topic.\
   * Tags help with organizing and filtering topics.
   *
   * @example ["cookies", "baking", "desserts"]
   */
  @IsOptional()
  @IsArray()
  @ApiProperty({
    required: false,
    description: 'A list of tags or categories related to the topic.',
    example: ['cookies', 'baking', 'desserts'],
    default: [],
  })
  tags?: string[];
}
