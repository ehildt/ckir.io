import { OllamaService } from '@ckir.io/ollama';
import { QdrantDistance, QdrantEmbeddingSize } from '@ckir.io/qdrant';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';

import { ConfigFactoryService } from '@/config-factory/config-factory.service';
import {
  ParamCollection,
  QueryDistance,
  QueryLimit,
  QueryOffset,
  QueryScore,
  QueryVectorSize,
} from '@/decorators/vectors.decorators';
import {
  ApiBodyText,
  ApiBodyVector,
  ApiParamCollection,
  ApiQueryDistance,
  ApiQueryLimit,
  ApiQueryOffset,
  ApiQueryScore,
  ApiQueryVectorSize,
} from '@/decorators/vectors.openapi';
import { VectorsService } from '@/services/vectors.service';

@ApiTags('Vectors')
@Controller('vectors')
export class VectorsController {
  constructor(
    private readonly vectorsService: VectorsService,
    private readonly ollamaService: OllamaService,
    private readonly factory: ConfigFactoryService,
  ) {}

  @Post('create/:collection')
  @ApiQueryDistance()
  @ApiParamCollection()
  @ApiQueryVectorSize()
  async createCollection(
    @QueryDistance() distance: QdrantDistance,
    @ParamCollection() collection: string,
    @QueryVectorSize() vectorSize: QdrantEmbeddingSize,
  ) {
    return this.vectorsService.createCollection(collection, vectorSize, distance);
  }

  @Post('search/similarity/text/:collection')
  @ApiConsumes('text/plain')
  @ApiBodyText()
  @ApiQueryLimit()
  @ApiQueryOffset()
  @ApiQueryScore()
  @ApiParamCollection()
  async searchText(
    @Body() text: string,
    @QueryLimit() limit: number,
    @QueryScore() score: number,
    @QueryOffset() offset: number,
    @ParamCollection() collection: string,
    // ! Filter queries that should be searchable
    // ! like the topic/thread/userId etc.
  ) {
    const { embeddings } = await this.ollamaService.embed({
      keep_alive: '15m',
      options: { embedding_only: true },
      model: this.factory.ollamaConfig.textEmbeddingModel,
      input: JSON.stringify(text),
    });
    return this.vectorsService.search(collection, embeddings[0], { limit, offset, score });
  }

  @Post('search/similarity/embedding/:collection')
  @ApiBodyVector()
  @ApiQueryLimit()
  @ApiQueryOffset()
  @ApiQueryScore()
  @ApiParamCollection()
  async search(
    @Body() vector: Array<number>,
    @QueryLimit() limit: number,
    @QueryScore() score: number,
    @QueryOffset() offset: number,
    @ParamCollection() collection: string,
    // ! Filter queries that should be searchable
    // ! like the topic/thread/userId etc.
  ) {
    return this.vectorsService.search(collection, vector, { limit, offset, score });
  }
}
