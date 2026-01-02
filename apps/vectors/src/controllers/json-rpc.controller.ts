import {
  Body,
  Controller,
  Headers,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ConditionalHeader } from '@/decorators/headers.decorator';
import { ApiMcpJsonRpc } from '@/decorators/vectors-mcp.decorators';
import { McpGenericType } from '@/dtos/json-rpc/mcp.model';
import { dedupeAndAggregate } from '@/helpers/dedupe-and-aggregate.helper';
import { HeaderValidationInterceptor } from '@/interceptors/header.interceptor';
import { McpValidationPipe } from '@/pipes/mcp-validation.pipe';
import { McpVectorsService } from '@/services/mcp-vectors.service';

@ApiTags('JSON-RPC')
@UseInterceptors(HeaderValidationInterceptor)
@Controller('mcp')
export class JsonRpcController {
  constructor(private readonly mcpVectorsService: McpVectorsService) {}

  @Post()
  @ApiMcpJsonRpc()
  @ConditionalHeader('x-embedding-llm')
  async rpc(
    @Body(new McpValidationPipe()) req: McpGenericType,
    @Headers('x-embedding-llm') xEmbeddingLLM?: string,
  ) {
    if (req.method === 'tools/list')
      return this.mcpVectorsService.getRequestedTools(req);

    if (req.params.function === 'vectors.collection.list')
      return this.mcpVectorsService.listCollections();

    if (req.params.function === 'vectors.collection.delete')
      return this.mcpVectorsService.deleteCollection(req);

    if (req.params.function === 'vectors.collection.create')
      return this.mcpVectorsService.createCollection(req);

    if (req.params.function === 'vectors.collection.embed.upsert')
      return this.mcpVectorsService.upsertPoints(req, xEmbeddingLLM);

    if (req.params.function === 'vectors.collection.embed.delete')
      return this.mcpVectorsService.deletePoints(req);

    if (req.params.function === 'vectors.collection.search.text') {
      const res = await this.mcpVectorsService.searchText(req, xEmbeddingLLM);
      return dedupeAndAggregate(res);
    }

    if (req.params.function === 'vectors.collection.search.vector') {
      const res = await this.mcpVectorsService.searchPoint(req);
      return dedupeAndAggregate(res);
    }
  }
}
