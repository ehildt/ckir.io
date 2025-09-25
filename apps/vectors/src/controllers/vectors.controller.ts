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
import { textToLines } from '@/helpers/text-to-lines.helper';
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
    // ! split into sentences and add text to the list - just like when seeding embeddings
    // ! deduplicate and aggregate the content, then fetch from the database.
    const inputs: Array<string> = textToLines(text);
    if (inputs?.length > 1) inputs.push(text);
    const { embeddings } = await this.ollamaService.embed({
      keep_alive: '15m',
      model: this.factory.ollamaConfig.textEmbeddingModel,
      input: inputs,
    });
    return this.vectorsService.searchBatch(collection, embeddings, { limit, offset, score });
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
  ) {
    return this.vectorsService.searchBatch(collection, [vector], { limit, offset, score });
  }
}
