import { MultipartFile } from '@fastify/multipart';
import {
  Controller,
  Headers,
  NotImplementedException,
  Post,
  Type,
  UseInterceptors,
} from '@nestjs/common';

import { ConditionalHeader } from '@/decorators/headers.decorator';
import { MultiPartFiles, MultiPartValue } from '@/decorators/visions.decorator';
import { ApiMcpJsonRpc } from '@/decorators/visions-mcp.decorators';
import {
  McpGenericType,
  SupportedToolFunction,
} from '@/dtos/json-rpc/mcp.model';
import { McpVisionPayloadReq } from '@/dtos/json-rpc/mcp-vision-payload-req.dto';
import { HeaderValidationInterceptor } from '@/interceptors/header.interceptor';
import { JsonRpcValidationPipe } from '@/pipes/json-rpc-validation.pipe';

const ALLOWED_MIME_TYPES = ['image/png', 'image/jpeg', 'image/webp'];

const MCP_DTO_MAP = new Map<SupportedToolFunction, Type>([
  ['visions.describe', McpVisionPayloadReq],
  ['visions.compare', McpVisionPayloadReq],
  ['visions.ocr', McpVisionPayloadReq],
]);

@UseInterceptors(HeaderValidationInterceptor)
@Controller('mcp')
export class JsonRpcController {
  constructor() {}

  @Post()
  @ApiMcpJsonRpc()
  @ConditionalHeader('x-vision-llm')
  async rpc(
    @Headers('x-vision-llm') vLLM: string,
    @MultiPartValue('payload', new JsonRpcValidationPipe(MCP_DTO_MAP))
    rpc: McpGenericType,
    @MultiPartFiles({
      required: false,
      fieldName: 'images',
      allowedMimeTypes: ALLOWED_MIME_TYPES,
    })
    images?: Array<MultipartFile>,
  ) {
    console.log(rpc, images);
    if (rpc.method === 'tools/list') throw new NotImplementedException();
  }
}
