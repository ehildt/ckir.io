import { OllamaService } from '@ehildt/ckir-ollama';
import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';

import { OllamaConfigService } from '@/configs/ollama-config.service';
import { McpJsonRpcResponse } from '@/dtos/mcp-call-response.dto';
import { McpToolsListResponse } from '@/dtos/mcp-list-response.dto';
import { McpGenericType } from '@/dtos/supported-tools.model';
import { McpCollectionCreateReq } from '@/dtos/vectors-mcp/mcp-collection-create-req.dto';
import { McpCollectionDeleteReq } from '@/dtos/vectors-mcp/mcp-collection-delete-req.dto';
import { McpCollectionEmbedDeleteReq } from '@/dtos/vectors-mcp/mcp-collection-embed-delete-req.dto';
import { McpCollectionEmbedUpsertReq } from '@/dtos/vectors-mcp/mcp-collection-embed-upsert-req.dto';
import { McpCollectionListReq } from '@/dtos/vectors-mcp/mcp-collection-list-req.dto';
import { McpCollectionSearchTextReq } from '@/dtos/vectors-mcp/mcp-collection-search-text-req.dto';
import { McpCollectionSearchVectorReq } from '@/dtos/vectors-mcp/mcp-collection-search-vector-req.dto';
import { dedupeAndAggregate } from '@/helpers/dedupe-and-aggregate.helper';
import { McpValidationPipe } from '@/pipes/mcp-validation.pipe';
import { McpVectorsService } from '@/services/mcp-vectors.service';
import { MCP_TOOLS_LIST } from '@/tools/tools.constants';

@ApiTags('MCP')
@Controller('mcp')
export class VectorsMcpController {
  constructor(
    private readonly vectorsMcpService: McpVectorsService,
    private readonly ollamaService: OllamaService,
    private readonly ollamaConfigService: OllamaConfigService,
  ) {}

  @Post()
  @ApiConsumes('application/json')
  @ApiExtraModels(
    McpCollectionListReq,
    McpCollectionCreateReq,
    McpCollectionDeleteReq,
    McpCollectionEmbedUpsertReq,
    McpCollectionEmbedDeleteReq,
    McpCollectionSearchTextReq,
    McpCollectionSearchVectorReq,
    McpJsonRpcResponse,
    McpToolsListResponse,
  )
  @ApiBody({
    schema: {
      oneOf: [
        { $ref: getSchemaPath(McpCollectionListReq) },
        { $ref: getSchemaPath(McpCollectionCreateReq) },
        { $ref: getSchemaPath(McpCollectionDeleteReq) },
        { $ref: getSchemaPath(McpCollectionEmbedUpsertReq) },
        { $ref: getSchemaPath(McpCollectionEmbedDeleteReq) },
        { $ref: getSchemaPath(McpCollectionSearchTextReq) },
        { $ref: getSchemaPath(McpCollectionSearchVectorReq) },
      ],
    },
  })
  @ApiOperation({
    description: `
    Processes an MCP request and returns the corresponding MCP response. 
    Use this endpoint to invoke MCP tools/capabilities exposed by the server. 
    The request body must conform to the MCP message schema; 
    responses follow the same protocol envelope.`,
  })
  @ApiOkResponse({
    schema: {
      oneOf: [
        { $ref: getSchemaPath(McpJsonRpcResponse) },
        { $ref: getSchemaPath(McpToolsListResponse) },
      ],
    },
  })
  // ! REFINE: selective dynamic discovery
  // like use a config server and config
  // allowed tools per service
  async rpc(@Body(new McpValidationPipe()) req: McpGenericType) {
    if (req.method === 'tools/list') return MCP_TOOLS_LIST;

    if (req.params.name === 'vectors.collection.list')
      return this.vectorsMcpService.listCollections();

    if (req.params.name === 'vectors.collection.delete')
      return this.vectorsMcpService.deleteCollection(req);

    if (req.params.name === 'vectors.collection.create')
      return this.vectorsMcpService.createCollection(req);

    if (req.params.name === 'vectors.collection.embed.upsert')
      return this.vectorsMcpService.upsertPoints(req);

    if (req.params.name === 'vectors.collection.embed.delete')
      return this.vectorsMcpService.deletePoints(req);

    if (req.params.name === 'vectors.collection.search.text') {
      const res = await this.vectorsMcpService.searchText(req);
      return dedupeAndAggregate(res);
    }

    if (req.params.name === 'vectors.collection.search.vector') {
      const res = await this.vectorsMcpService.searchPoint(req);
      return dedupeAndAggregate(res);
    }
  }
}
