import { hashPayload } from '@ehildt/ckir-helpers';
import { RedlockService } from '@ehildt/ckir-redlock';
import { MultipartFile, MultipartValue } from '@fastify/multipart';
import {
  BadRequestException,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  ParseBoolPipe,
  ParseEnumPipe,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import {
  MultiPartFiles,
  MultiPartValue,
  TaskParam,
} from '@/decorators/visions.decorator';
import { ApiVision } from '@/decorators/visions.openapi';
import {
  FastifyMultipartMeta,
  VisionTask,
} from '@/helpers/get-fastify-multipart-data.helper';
import { VisionsService } from '@/services/visions.service';

const ALLOWED_MIME_TYPES = ['image/png', 'image/jpeg', 'image/webp'];

@ApiTags('Images')
@Controller('vision')
export class VisionsController {
  constructor(
    private readonly visionsService: VisionsService,
    private readonly redlock: RedlockService,
  ) {}

  @Post('tasks/:task')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiVision()
  async vision(
    @Param('task', new ParseEnumPipe(TaskParam)) task: VisionTask,
    @Query('roomId') roomId: string,
    @Query('batchId') batchId: string,
    @Headers('x-vision-llm') vLLM: string,
    @Query('stream', new ParseBoolPipe({ optional: true })) stream: boolean,
    @MultiPartFiles('images', ALLOWED_MIME_TYPES) images: Array<MultipartFile>,
    @MultiPartValue('prompt') { value }: MultipartValue<string>,
    @Query('numCtx', new ParseIntPipe({ optional: true })) numCtx?: number,
  ) {
    if (!vLLM) throw new BadRequestException();
    const meta: Array<FastifyMultipartMeta> = [];
    const buffers: Array<Buffer<ArrayBufferLike>> = [];

    for (const file of images) {
      const buffer = await file.toBuffer();
      const hash = hashPayload(buffer, 'sha256');
      buffers.push(buffer);
      meta.push({
        name: file.filename,
        type: file.mimetype,
        hash: `${hash}_${batchId}`, // ! send a simple hmac?
      });
    }

    void this.visionsService.emit({
      filters: {
        vLLM,
        batchId,
        prompt: value,
        roomId,
        stream,
        task,
        numCtx,
      },
      buffers,
      meta,
    });
  }
}
