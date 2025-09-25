import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

/**
 * Represents a request to apply an emoji reaction to a post. \
 * This class contains details about the emoji type and the count of users who have reacted with it.
 */
export class PostsEmojiReq {
  /**
   * The label of the emoji reaction applied to this post. \
   * This field indicates which emoji was used (e.g., 'laugh', 'heart').
   *
   * @example "laugh"
   */
  @IsString()
  @ApiProperty({
    default: 'laugh',
    required: true,
    description: 'The label of the emoji reaction applied to this post.',
  })
  label: string;

  /**
   * The number of users who have reacted with this emoji. \
   * This field tracks how many unique users have selected the specified emoji.
   *
   * @example 10
   */
  @IsNumber()
  @ApiProperty({
    default: 0,
    required: true,
    description: 'Number of users who reacted with this emoji.',
  })
  count: number;
}
