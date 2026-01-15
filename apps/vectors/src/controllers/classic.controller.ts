import { TextToLines } from '@ehildt/ckir-helpers';
import { OllamaService } from '@ehildt/ckir-ollama';
import { QdrantDistance, QdrantEmbeddingSize } from '@ehildt/ckir-qdrant';
import { Body, Controller, Delete, Get, Headers, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';

import {
  ParamCollection,
  QueryCollection,
  QueryDistance,
  QueryIncludeVector,
  QueryLimit,
  QueryOffset,
  QueryScore,
  QueryVectorSize,
} from '@/decorators/vectors.decorators';
import {
  ApiCreateCollection,
  ApiParamCollection,
  ApiSearchText,
  ApiSearchVector,
  ApiUpsertEmbeddings,
} from '@/decorators/vectors.openapi';
import { CollectionEmbedDeleteReq } from '@/dtos/classic/collection-embed-delete-req.dto';
import { CollectionEmbedSearchTextReq } from '@/dtos/classic/collection-embed-search-text-req.dto';
import { CollectionEmbedSearchVectorReq } from '@/dtos/classic/collection-embed-search-vector-req.dto';
import { CollectionEmbedUpsertReq } from '@/dtos/classic/collection-embed-upsert-req.dto';
import { dedupeAndAggregate } from '@/helpers/dedupe-and-aggregate.helper';
import { VectorsService } from '@/services/vectors.service';

@ApiTags('Classic')
@Controller('collections')
export class ClassicController {
  constructor(
    private readonly vectorsService: VectorsService,
    private readonly ollamaService: OllamaService,
  ) {}

  @Get()
  async listCollections() {
    return this.vectorsService.listCollections();
  }

  @Delete(':collection')
  @ApiParamCollection()
  async deleteCollection(@ParamCollection() collection: string) {
    return this.vectorsService.deleteCollection(collection);
  }

  @Post()
  @ApiCreateCollection()
  async createCollection(
    @QueryDistance() distance: QdrantDistance,
    @QueryCollection() collection: string,
    @QueryVectorSize() vectorSize: QdrantEmbeddingSize,
  ) {
    return this.vectorsService.createCollection(
      collection,
      vectorSize,
      distance,
    );
  }

  @ApiUpsertEmbeddings()
  @Post(':collection/embeddings')
  async upsertEmbeddings(
    @Body() req: CollectionEmbedUpsertReq,
    @ParamCollection() collection: string,
    @QueryIncludeVector() includeVector: boolean,
    @Headers('x-embedding-llm') xEmbeddingLLM: string,
  ) {
    return this.vectorsService.upsertEmbeddings(
      collection,
      req,
      xEmbeddingLLM,
      includeVector,
    );
  }

  @Delete(':collection/embeddings')
  @ApiBody({
    type: CollectionEmbedDeleteReq,
  })
  async deleteEmbedding(
    @ParamCollection() collection: string,
    @Body() req: CollectionEmbedDeleteReq,
  ) {
    return this.vectorsService.deletePoints(collection, req.pointIds);
  }

  @ApiSearchText()
  @Post(':collection/searches/text')
  async searchText(
    @QueryLimit() limit: number,
    @QueryScore() score: number,
    @QueryOffset() offset: number,
    @ParamCollection() collection: string,
    @Body() body: CollectionEmbedSearchTextReq,
    @Headers('x-embedding-llm') xEmbeddingLLM: string,
  ) {
    const ttl = new TextToLines(body.text);
    if (ttl?.lines > 1) ttl.append(body.text);
    const { embeddings } = await this.ollamaService.embed({
      keep_alive: '15m',
      model: xEmbeddingLLM,
      input: ttl.build(),
    });

    const res = await this.vectorsService.searchBatch(collection, embeddings, {
      limit,
      offset,
      score,
      filter: body.filters,
    });

    return dedupeAndAggregate(res);
  }

  @ApiSearchVector()
  @Post(':collection/searches/vector')
  async searchVector(
    @Body() body: CollectionEmbedSearchVectorReq,
    @QueryLimit() limit: number,
    @QueryScore() score: number,
    @QueryOffset() offset: number,
    @ParamCollection() collection: string,
  ) {
    return this.vectorsService.searchBatch(collection, [body.vector], {
      limit,
      offset,
      score,
      filter: body.filters,
    });
  }
}
