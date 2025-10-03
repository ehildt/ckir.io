import { textToLines } from '@ckir.io/helpers';
import { OllamaService } from '@ckir.io/ollama';
import { QdrantDistance, QdrantEmbeddingSize } from '@ckir.io/qdrant';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';

import { ConfigFactoryService } from '@/config-factory/config-factory.service';
import {
  ParamCollection,
  QueryDistance,
  QueryFilterType,
  QueryFilterTypeEnum,
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
  ApiQueryFilterType,
  ApiQueryLimit,
  ApiQueryOffset,
  ApiQueryScore,
  ApiQueryVectorSize,
} from '@/decorators/vectors.openapi';
import { dedupeAndAggregate } from '@/helpers/dedupe-and-aggregate.helper';
import { VectorsService } from '@/services/vectors.service';

@ApiTags('Visions')
@Controller('visions')
export class VisionsController {
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
    return this.vectorsService.createCollection(
      collection,
      vectorSize,
      distance,
    );
  }

  @Post('search/similarity/text/:collection')
  @ApiConsumes('text/plain')
  @ApiBodyText()
  @ApiQueryLimit()
  @ApiQueryOffset()
  @ApiQueryScore()
  @ApiParamCollection()
  @ApiQueryFilterType()
  async searchText(
    @Body() text: string,
    @QueryLimit() limit: number,
    @QueryScore() score: number,
    @QueryOffset() offset: number,
    @QueryFilterType() type: QueryFilterTypeEnum,
    @ParamCollection() collection: string,
  ) {
    const filterType = type
      ? type
      : [
          QueryFilterTypeEnum.Topic,
          QueryFilterTypeEnum.Thread,
          QueryFilterTypeEnum.Post,
        ];
    const input: Array<string> = textToLines(text);
    if (input?.length > 1) input.push(text);
    // ! here we need to call the visions model
    // ! we don't embed automatically because we want the user to approve
    const { embeddings } = await this.ollamaService.embed({
      keep_alive: '15m',
      model: this.factory.ollamaConfig.visionModel,
      input,
    });

    return dedupeAndAggregate(
      await this.vectorsService.searchBatch(collection, embeddings, {
        limit,
        offset,
        score,
        filter: { type: filterType },
      }),
    );
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
    return this.vectorsService.searchBatch(collection, [vector], {
      limit,
      offset,
      score,
    });
  }
}
