import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

/**
 * Represents a request to upload an attachment to a post.\
 * This class contains metadata about the attachment such as file details,\
 * URL, upload time, and optional metadata for further context.
 */
export class PostsAttachmentReq {
  /**
   * The unique identifier for the uploaded file.\
   * This identifier is used to reference the file in the storage system.
   *
   * @example "clkt4f3x0000s4xw1v7f95hz9x000002"
   */
  @IsString()
  @ApiProperty({
    example: 'clkt4f3x0000s4xw1v7f95hz9x000002',
    description: 'The reference to the uploaded file',
  })
  fileId: string;

  /**
   * The original filename of the uploaded attachment.\
   * This is the file name given when the user uploads the file.
   *
   * @example "document.pdf"
   */
  @IsString()
  @ApiProperty({
    example: 'document.pdf',
    description: 'The original filename of the uploaded attachment',
  })
  filename: string;

  /**
   * The MIME type of the uploaded attachment.\
   * This defines the file type, such as 'application/pdf' or 'image/jpeg'.
   *
   * @example "application/pdf"
   */
  @IsString()
  @ApiProperty({
    example: 'application/pdf',
    description: 'The MIME type of the uploaded attachment',
  })
  mimeType: string;

  /**
   * The size of the file in bytes.\
   * This helps to determine the file size and can be used for validation purposes.
   *
   * @example "1048576"
   */
  @IsNumber()
  @ApiProperty({
    example: 1048576,
    description: 'The size of the file in bytes',
  })
  fileSize: number;

  /**
   * The URL where the attachment can be accessed.\
   * This URL points to the location where the file can be retrieved.
   *
   * @example "https://example.com/uploads/clkt4f3x0000s4xw1v7f95hz9x000002/document.pdf"
   */
  @IsUrl()
  @ApiProperty({
    example:
      'https://example.com/uploads/clkt4f3x0000s4xw1v7f95hz9x000002/document.pdf',
    description: 'The URL where the attachment can be accessed',
  })
  url: string;

  /**
   * The date and time when the attachment was uploaded in ISO 8601 format.\
   * This is used for tracking the upload time of the file.
   *
   * @example "2023-08-17T12:34:56Z"
   */
  @IsDate()
  @Type(() => Date)
  @ApiProperty({
    example: new Date('2023-08-17T12:34:56Z'),
    description:
      'The date and time when the attachment was uploaded in ISO 8601 format',
  })
  uploadedAt: Date;

  /**
   * Optional metadata related to the attachment.\
   * This can include additional context such as the author, description, or other custom data.
   *
   * @example { author: 'John Doe', description: 'Sample document' }
   */
  @IsOptional()
  @IsObject()
  @ApiProperty({
    example: { author: 'John Doe', description: 'Sample document' },
    description: 'Optional metadata related to the attachment',
  })
  meta?: any;
}
