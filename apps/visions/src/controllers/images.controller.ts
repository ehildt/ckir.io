import { Controller, HttpCode, HttpStatus, Post, Req } from '@nestjs/common';
import { ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FastifyRequest } from 'fastify';

import { ApiBodyFileMultipart } from '@/decorators/visions.decorator';
import { getFastifyMultipartDataWithFilters } from '@/helpers/get-fastify-multipart-data.helper';
import { VisionsService } from '@/services/visions.service';

@ApiTags('Images')
@Controller('images')
export class ImagesController {
  constructor(private readonly visionsService: VisionsService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBodyFileMultipart()
  @ApiResponse({ status: HttpStatus.ACCEPTED, description: '' })
  @HttpCode(202)
  async describeImages(@Req() req: FastifyRequest) {
    const data = await getFastifyMultipartDataWithFilters(req);
    return this.visionsService.emit(data);
  }
}
