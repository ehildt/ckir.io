import { ApiProperty } from '@nestjs/swagger';
import type { EmbedResponse } from 'ollama';

export class CollectionEmbedUpsertRes implements EmbedResponse {
  @ApiProperty({ example: 'nomic-embed-text' })
  model: string;

  @ApiProperty({ type: [Number], example: [[0.1, -0.2, 0.03]] })
  embeddings: Array<Array<number>>;

  @ApiProperty({ type: Number })
  load_duration: number;

  @ApiProperty({ type: Number })
  prompt_eval_count: number;

  @ApiProperty({ type: Number })
  total_duration: number;
}
