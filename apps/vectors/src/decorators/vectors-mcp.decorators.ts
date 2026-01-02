import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiExtraModels,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  getSchemaPath,
} from '@nestjs/swagger';

import { McpCollectionCreateReq } from '@/dtos/json-rpc/mcp-collection-create-req.dto';
import { McpCollectionCreateRes } from '@/dtos/json-rpc/mcp-collection-create-res.dto';
import { McpCollectionDeleteReq } from '@/dtos/json-rpc/mcp-collection-delete-req.dto';
import { McpCollectionEmbedDeleteReq } from '@/dtos/json-rpc/mcp-collection-embed-delete-req.dto';
import { McpCollectionEmbedUpsertReq } from '@/dtos/json-rpc/mcp-collection-embed-upsert-req.dto';
import { McpCollectionEmbedUpsertRes } from '@/dtos/json-rpc/mcp-collection-embed-upsert-res.dto';
import { McpCollectionJsonRpcRes } from '@/dtos/json-rpc/mcp-collection-json-rpc-res.dto';
import { McpCollectionListReq } from '@/dtos/json-rpc/mcp-collection-list-req.dto';
import { McpToolsListResultRes } from '@/dtos/json-rpc/mcp-collection-list-res.dto';
import { McpCollectionSearchTextReq } from '@/dtos/json-rpc/mcp-collection-search-text-req.dto';
import { McpCollectionSearchVectorReq } from '@/dtos/json-rpc/mcp-collection-search-vector-req.dto';
import { McpToolsListReq } from '@/dtos/json-rpc/mcp-tools-list.dto';

export function ApiMcpJsonRpc() {
  return applyDecorators(
    ApiConsumes('application/json'),
    ApiExtraModels(
      McpToolsListReq,
      McpCollectionListReq,
      McpCollectionCreateReq,
      McpCollectionDeleteReq,
      McpCollectionEmbedUpsertReq,
      McpCollectionEmbedDeleteReq,
      McpCollectionSearchTextReq,
      McpCollectionSearchVectorReq,
      McpCollectionJsonRpcRes,
      McpToolsListResultRes,
      McpCollectionEmbedUpsertRes,
      McpCollectionCreateRes,
    ),
    ApiBody({
      schema: {
        oneOf: [
          { $ref: getSchemaPath(McpToolsListReq) },
          { $ref: getSchemaPath(McpCollectionListReq) },
          { $ref: getSchemaPath(McpCollectionCreateReq) },
          { $ref: getSchemaPath(McpCollectionDeleteReq) },
          { $ref: getSchemaPath(McpCollectionEmbedUpsertReq) },
          { $ref: getSchemaPath(McpCollectionEmbedDeleteReq) },
          { $ref: getSchemaPath(McpCollectionSearchTextReq) },
          { $ref: getSchemaPath(McpCollectionSearchVectorReq) },
        ],
      },
    }),
    ApiOperation({
      description: `
      Processes an MCP request and returns the corresponding MCP response. 
      Use this endpoint to invoke MCP tools/capabilities exposed by the server. 
      The request body must conform to the MCP message schema; 
      responses follow the same protocol envelope.`,
    }),
    ApiOkResponse({
      type: McpCollectionJsonRpcRes,
    }),
    ApiHeader({
      name: 'x-embedding-llm',
      description: 'Specifies which LLM to use for embedding',
      required: false,
      schema: {
        type: 'string',
        example: 'embeddinggemma',
      },
    }),
  );
}
