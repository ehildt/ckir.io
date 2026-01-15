import { hashPayload } from '@ehildt/ckir-helpers';
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
import { ApiConsumes, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

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

const ALLOWED_MIME_TYPES = ['image/png', 'image/jpeg', 'image/webp'];

@ApiTags('Images')
@Controller('vision')
export class VisionsController {
  constructor(private readonly visionsService: VisionsService) {}

  @Post('tasks/:task')
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description: [
      'Accepted.',
      'Processing will occur asynchronously,',
      'and the result will be delivered via Socket.IO.',
    ].join(' '),
  })
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiBodySchema()
  @ApiTaskParam()
  @ApiQuery({
    type: Boolean,
    default: 'false',
    required: false,
    name: 'stream',
  })
  @ApiQuery({
    name: 'numCtx',
    required: false,
    type: Number,
    example: '32000',
  })
  async vision(
    @Param('task', new ParseEnumPipe(TaskParam)) task: VisionTask,
    @Query('roomId') roomId: string,
    @Query('batchId') batchId: string,
    @Headers('x-vision-llm') vLLM: string,
    @MultiPartFiles('images', ALLOWED_MIME_TYPES) images: Array<MultipartFile>,
    @MultiPartValue('prompt') { value }: MultipartValue<string>,
    @Query('stream', new ParseBoolPipe({ optional: true })) stream: boolean,
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
