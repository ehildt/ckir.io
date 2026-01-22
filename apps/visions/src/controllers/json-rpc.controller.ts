import { MultipartFile } from '@fastify/multipart';
import {
  BadRequestException,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  ParseBoolPipe,
  ParseIntPipe,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';

import { ConsumesHeader } from '@/decorators/headers.decorator';
import {
  MultiPartImages,
  MultiPartPayload,
} from '@/decorators/json-rpc.decorators';
import { ApiMcpJsonRpc } from '@/decorators/json-rpc.openapi.decorators';
import { McpGenericType } from '@/dtos/json-rpc/mcp.model';
import { McpVisionPayloadReq_Params } from '@/dtos/json-rpc/mcp-vision-payload-req.dto';
import { HeaderValidationInterceptor } from '@/interceptors/header.interceptor';
import { JsonRpcService } from '@/services/json-rpc.service';

@Controller('mcp')
@UseInterceptors(HeaderValidationInterceptor) // ! what we want is probably a guard
export class JsonRpcController {
  constructor(private readonly jsonRpcService: JsonRpcService) {}

  @Post()
  @ApiMcpJsonRpc()
  @HttpCode(HttpStatus.ACCEPTED)
  @ConsumesHeader('x-vision-llm') // ! what we want is probably a guard
  async rpc(
    @Query('batchId') batchId: string,
    @Query('stream', new ParseBoolPipe({ optional: true })) stream: boolean,
    @Headers('x-vision-llm') vLLM: string,
    @MultiPartPayload() req: McpGenericType<McpVisionPayloadReq_Params>,
    @Query('roomId') roomId?: string,
    @Query('numCtx', new ParseIntPipe({ optional: true })) numCtx?: number,
    @MultiPartImages() images?: Array<MultipartFile>,
  ) {
    if (req.method === 'tools/list')
      return this.jsonRpcService.getRequestedTools(req);

    if (!vLLM) throw new BadRequestException('Missing x-vision-llm header');
    if (!images.length) throw new BadRequestException('Missing images');

    const results = await this.jsonRpcService.toFilePayloads(batchId, images);

    if (req.params.function === 'visions.analyze')
      return this.jsonRpcService.analyze({
        buffers: results.map((r) => r.buffer),
        meta: results.map((r) => r.meta),
        filters: {
          vLLM,
          batchId,
          roomId,
          stream,
          numCtx,
          prompt: req.params.arguments.prompt,
          task: req.params.arguments.task,
        },
      });
  }
}
