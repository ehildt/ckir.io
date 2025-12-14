import { TextToLines } from '@ehildt/ckir-helpers';
import { OllamaService } from '@ehildt/ckir-ollama';
import { QdrantDistance, QdrantEmbeddingSize } from '@ehildt/ckir-qdrant';
import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { OllamaConfigService } from '@/configs/ollama-config.service';
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
import { CollectionEmbedUpsertReq } from '@/dtos/vectors/collection-embed-upsert-req.dto';
import { McpEmbedResponse } from '@/dtos/vectors/mcp-embed-response.dto';
import { dedupeAndAggregate } from '@/helpers/dedupe-and-aggregate.helper';
import { VectorsService } from '@/services/vectors.service';

@ApiTags('Vectors')
@Controller('vectors')
export class VectorsController {
  constructor(
    private readonly vectorsService: VectorsService,
    private readonly ollamaService: OllamaService,
    private readonly ollamaConfigService: OllamaConfigService,
  ) {}

  @Post(':collection/create')
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

  @Post(':collection/embed')
  @ApiOperation({
    description: `
    Accepts text input and generates embeddings using the configured embedding model. 
    Input is segmented, so multiple embeddings may be returned.`,
  })
  @ApiCreatedResponse({ type: McpEmbedResponse })
  @ApiBody({ type: CollectionEmbedUpsertReq })
  async createEmbedding(
    @Body() req: CollectionEmbedUpsertReq,
    @ParamCollection() collection: string,
  ) {
    return this.vectorsService.upsertEmbeddings(collection, req);
  }

  @Post(':collection/search/text')
  @ApiConsumes('text/plain')
  @ApiBodyText()
  @ApiQueryLimit()
  @ApiQueryOffset()
  @ApiQueryScore()
  @ApiParamCollection()
  // ! add header for the model
  async searchText(
    // ! content && filters in body
    @Body() text: string,
    @QueryLimit() limit: number,
    @QueryScore() score: number,
    @QueryOffset() offset: number,
    @ParamCollection() collection: string,
  ) {
    const ttl = new TextToLines(text);
    if (ttl?.lines > 1) ttl.append(text);
    const { embeddings } = await this.ollamaService.embed({
      keep_alive: '15m',
      model:
        this.ollamaConfigService.xOllamaConfig.x_options.textEmbeddingModel,
      input: ttl.build(),
    });

    const res = await this.vectorsService.searchBatch(collection, embeddings, {
      limit,
      offset,
      score,
      // ! filter: { type: filterType },
    });

    return dedupeAndAggregate(res);
  }

  @Post(':collection/search/vector')
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
