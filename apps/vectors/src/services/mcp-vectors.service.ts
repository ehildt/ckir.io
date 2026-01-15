import { omit, TextToLines } from '@ehildt/ckir-helpers';
import { OllamaService } from '@ehildt/ckir-ollama';
import { QdrantService } from '@ehildt/ckir-qdrant';
import { BadRequestException, Injectable } from '@nestjs/common';

import { OllamaConfigService } from '@/configs/ollama-config.service';
import {
  McpGenericType,
  SupportedToolFunction,
} from '@/dtos/json-rpc/mcp.model';
import { McpCollectionCreateReq } from '@/dtos/json-rpc/mcp-collection-create-req.dto';
import { McpCollectionDeleteReq } from '@/dtos/json-rpc/mcp-collection-delete-req.dto';
import { McpCollectionEmbedDeleteReq } from '@/dtos/json-rpc/mcp-collection-embed-delete-req.dto';
import { McpCollectionEmbedUpsertReq } from '@/dtos/json-rpc/mcp-collection-embed-upsert-req.dto';
import { McpCollectionSearchTextReq } from '@/dtos/json-rpc/mcp-collection-search-text-req.dto';
import { McpCollectionSearchVectorReq } from '@/dtos/json-rpc/mcp-collection-search-vector-req.dto';
import { JSON_RPC_TOOLS_LIST } from '@/tools/tools.constants';

@Injectable()
export class McpVectorsService {
  constructor(
    private readonly qdrantService: QdrantService,
    private readonly ollamaService: OllamaService,
    private readonly ollamaConfigService: OllamaConfigService,
  ) {}

  async getRequestedTools(req: McpGenericType) {
    const rTools: Array<SupportedToolFunction> = req.params?.requestedTools;
    if (!rTools?.length) return JSON_RPC_TOOLS_LIST;

    const available = new Set(
      JSON_RPC_TOOLS_LIST.result.tools.map((t) => t.name),
    );

    rTools.forEach((rt) => {
      if (!available.has(rt))
        throw new BadRequestException(`No such tool available ${rt}`);
    });

    return {
      ...JSON_RPC_TOOLS_LIST,
      result: {
        tools: JSON_RPC_TOOLS_LIST.result.tools.filter(({ name }) =>
          rTools.includes(name),
        ),
      },
    };
  }

  async listCollections() {
    return this.qdrantService.listCollections();
  }

  async deleteCollection(req: McpCollectionDeleteReq) {
    const { collection } = req.params.arguments;
    return this.qdrantService.deleteCollection(collection);
  }

  async deletePoints(req: McpCollectionEmbedDeleteReq) {
    const { collection, pointIds } = req.params.arguments;
    return this.qdrantService.deletePoints(collection, pointIds);
  }

  async createCollection(req: McpCollectionCreateReq) {
    const { collection, vectorSize, distance } = req.params.arguments;
    return this.qdrantService.createCollection(
      collection,
      vectorSize,
      distance,
    );
  }

  async upsertPoints(req: McpCollectionEmbedUpsertReq, xEmbeddingLLM: string) {
    const { collection, payload } = req.params.arguments;

    if (!req.params.arguments.content)
      throw new BadRequestException('content is required');

    const ttl = new TextToLines(req.params.arguments.content);
    const response = await this.ollamaService.embed({
      options: { embedding_only: true },
      input: ttl.build(),
      keep_alive: this.ollamaConfigService.config.keepAlive,
      model: xEmbeddingLLM,
    });

    await this.qdrantService.upsertPoints(
      collection,
      response.embeddings.map((embedding) => ({ embedding })),
      payload,
    );

    return !req.params?.includeVector
      ? omit(response, ['embeddings'])
      : response;
  }

  async searchText(req: McpCollectionSearchTextReq, xEmbeddingLLM: string) {
    const { collection, content, ...rest } = req.params.arguments;
    const ttl = new TextToLines(content);
    if (ttl?.lines > 1) ttl.append(content);
    const response = await this.ollamaService.embed({
      keep_alive: this.ollamaConfigService.config.keepAlive,
      model: xEmbeddingLLM,
      input: ttl.build(),
    });

    return this.qdrantService.searchBatch(collection, response.embeddings, {
      filter: rest.filters,
      limit: rest.limit,
      offset: rest.offset,
      score: rest.score,
    });
  }

  async searchPoint(req: McpCollectionSearchVectorReq) {
    const { collection, vector, ...rest } = req.params.arguments;
    return this.qdrantService.searchBatch(collection, [vector], rest);
  }
}
