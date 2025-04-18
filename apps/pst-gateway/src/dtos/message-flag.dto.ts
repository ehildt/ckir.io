import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

/**
 * Represents a request to flag a message with a specific label. \
 * This class includes details about the flag label and the user responses (agree or disagree).
 */
export class MessageFlagReq {
  /**
   * The flag label applied to the message (e.g., 'HATE_SPEECH', 'PROPAGANDA', 'MEME'). \
   * This field indicates the nature of the flag being applied by users.
   *
   * @example "MEME"
   */
  @IsString()
  @ApiProperty({
    default: 'MEME',
    required: true,
    description: 'The flag label (e.g., HATE_SPEECH, PROPAGANDA, MEME, etc.) applied to the message.',
  })
  label: string;

  /**
   * The number of users who agree that the flag label accurately describes the message. \
   * This field is used to track the level of agreement with the flag applied.
   *
   * @example 5
   */
  @IsNumber()
  @ApiProperty({
    default: 0,
    required: true,
    description: 'The number of users who agree that this flag label appropriately describes the message.',
  })
  agree: number;

  /**
   * The number of users who disagree that the flag label accurately describes the message. \
   * This field is used to track the level of disagreement with the flag applied.
   *
   * @example 2
   */
  @IsNumber()
  @ApiProperty({
    default: 0,
    required: true,
    description: 'The number of users who disagree that this flag label appropriately describes the message.',
  })
  disagree: number;
}
