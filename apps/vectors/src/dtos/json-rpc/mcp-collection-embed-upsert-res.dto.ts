import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class McpCollectionEmbedUpsertRes {
  @ApiProperty({
    example: 'embeddinggemma',
    description: 'The name of the model used to generate embeddings',
  })
  @IsString()
  @IsNotEmpty()
  model: string;

  @ApiProperty({
    type: 'array',
    items: {
      type: 'array',
      items: { type: 'number' },
    },
    example: [[-0.14396961, -0.012833647, 0.008047754]],
    description:
      'An array of embedding vectors (each vector is an array of floats)',
  })
  @IsArray({ each: true })
  embeddings: number[][];

  @ApiProperty({
    example: 6719711302,
    description: 'Total processing time in nanoseconds',
  })
  @IsNumber()
  total_duration: number;

  @ApiProperty({
    example: 4928255281,
    description: 'Time taken to load the model in nanoseconds',
  })
  @IsNumber()
  load_duration: number;

  @ApiProperty({
    example: 14,
    description: 'Number of tokens in the prompt',
  })
  @IsNumber()
  prompt_eval_count: number;
}
