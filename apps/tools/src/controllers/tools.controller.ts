import { hashPayload } from '@ehildt/ckir-helpers';
import { MultipartFile, MultipartValue } from '@fastify/multipart';
import {
  BadRequestException,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';

import {
  ApiBodySchema,
  ApiTaskParam,
  MultiPartFiles,
  MultiPartValue,
} from '@/decorators/tools.decorator';
import { ChatsTask } from '@/helpers/get-fastify-multipart-data.helper';
import { ToolsService } from '@/services/tools.service';

@ApiTags('Tools')
@Controller('groups')
export class ToolsController {
  constructor(private readonly textsService: ToolsService) {}

  @Post(':groupId/tasks/:task/tools')
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: HttpStatus.ACCEPTED, description: '' })
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiBodySchema()
  @ApiTaskParam()
  async texts(
    @Param('task') task: ChatsTask,
    @Query('stream') stream: boolean,
    @Query('roomId') roomId: string,
    @Param('groupId') groupId: string,
    @Headers('x-ai-llm') aiLLM: string,
    @MultiPartFiles('files') files: Array<MultipartFile>,
    @MultiPartValue('prompt') { value }: MultipartValue<string>,
  ) {
    if (!aiLLM) throw new BadRequestException();
    const meta: Array<any> = [];
    const buffers: Array<Buffer<ArrayBufferLike>> = [];

    for (const file of files) {
      const buffer = await file.toBuffer();
      const hash = hashPayload(buffer, 'sha256');
      buffers.push(buffer);
      meta.push({
        name: file.filename,
        type: file.mimetype,
        hash: `${hash}_${groupId}`,
      });
    }

    void this.textsService.emit({
      filters: {
        aiLLM,
        groupId,
        prompt: value,
        roomId,
        stream,
        task,
      },
      buffers,
      meta,
    });
  }
}
