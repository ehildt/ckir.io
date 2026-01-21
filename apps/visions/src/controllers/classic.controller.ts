import { hashPayload } from '@ehildt/ckir-helpers';
import { MultipartFile, MultipartValue } from '@fastify/multipart';
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
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { MultiPartFiles, MultiPartValue } from '@/decorators/visions.decorator';
import { ApiVision } from '@/decorators/visions.openapi';
import {
  FastifyMultipartMeta,
  VisionTask,
} from '@/dtos/classic/get-fastify-multipart-data-req.dto';
import { ClassicService } from '@/services/classic.service';

const ALLOWED_MIME_TYPES = ['image/png', 'image/jpeg', 'image/webp'];

@ApiTags('Images')
@Controller('vision')
export class ClassicController {
  constructor(private readonly visionsService: ClassicService) {}

  @Post()
  @ApiVision()
  @HttpCode(HttpStatus.ACCEPTED)
  async visionStream(
    @Query('batchId') batchId: string,
    @Headers('x-vision-llm') vLLM: string,
    @Query('stream', new ParseBoolPipe({ optional: true })) stream: boolean,
    @MultiPartValue('task') task: MultipartValue<VisionTask>,
    @Query('roomId') roomId?: string,
    @MultiPartValue('prompt') prompt?: MultipartValue<string>,
    @Query('numCtx', new ParseIntPipe({ optional: true })) numCtx?: number,
    @MultiPartFiles({
      fieldName: 'images',
      allowedMimeTypes: ALLOWED_MIME_TYPES,
    })
    images?: Array<MultipartFile>,
  ) {
    if (!vLLM) throw new BadRequestException('Missing x-vision-llm header');
    for (const file of images) {
      const buffer = await file.toBuffer();
      const meta: FastifyMultipartMeta = {
        name: file.filename,
        type: file.mimetype,
        hash: `${hashPayload(buffer, 'sha256')}_${batchId}`,
      };

      void this.visionsService.emit({
        buffers: [buffer],
        meta: [meta],
        filters: {
          vLLM,
          batchId,
          roomId,
          stream,
          numCtx,
          prompt: prompt?.value,
          task: task?.value,
        },
      });
    }
  }
}
