import { hashPayload } from '@ehildt/ckir-helpers';
import { MultipartFile, MultipartValue } from '@fastify/multipart';
import {
  BadRequestException,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  ParseEnumPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';

import {
  ApiBodySchema,
  ApiTaskParam,
  MultiPartFiles,
  MultiPartValue,
  TaskParam,
} from '@/decorators/visions.decorator';
import {
  FastifyMultipartMeta,
  VisionTask,
} from '@/helpers/get-fastify-multipart-data.helper';
import { VisionsService } from '@/services/visions.service';

@ApiTags('Images')
@Controller('groups')
export class ImagesController {
  constructor(private readonly visionsService: VisionsService) {}

  @Post(':groupId/tasks/:task/images')
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: HttpStatus.ACCEPTED, description: '' })
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiBodySchema()
  @ApiTaskParam()
  async describeImages(
    @Param('task', new ParseEnumPipe(TaskParam))
    task: VisionTask,
    @Query('stream') stream: boolean,
    @Query('roomId') roomId: string,
    @Param('groupId') groupId: string,
    @Headers('x-ai-llm') aiLLM: string,
    @MultiPartFiles('files') files: Array<MultipartFile>,
    @MultiPartValue('prompt') { value }: MultipartValue<string>,
  ) {
    if (!aiLLM) throw new BadRequestException();
    const meta: Array<FastifyMultipartMeta> = [];
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

    void this.visionsService.emit({
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
