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
    await this.visionsService.emit(data);

    /*     for (let i = 0; i < buffers.length; i++) {
      const buffer = buffers[i];
      const filename = meta[i]?.filename || `image_${i + 1}`;

      const prompts: Prompt[] = [];

      if (filters.prompt) {
        prompts.push({
          role: 'user',
          content: filters.prompt,
        });
      }

      if (filters.ocr) {
        prompts.push({
          role: 'assistant',
          images: [buffer],
          content: `You are an OCR assistant. Extract all text from the provided image. 
          Return only the raw text content. Do not add explanations or comments.`,
        });
      } else {
        const visionContent = [
          `You are a vision-to-text model. Provide a detailed, factual description of the image.`,
          `File: ${filename}`,
        ];

        if (filters.focus)
          visionContent.push('Focus only on the main subject.');

        prompts.push({
          role: 'assistant',
          content: visionContent.join('\n'),
          images: [buffer],
        });
      }

      const reply = await this.ollamaService.chat({
        stream: filters.stream,
        keep_alive: this.ollamaConfigService.xOllamaConfig.keepAlive,
        model: this.ollamaConfigService.xOllamaConfig.x_options.visionModel,
        messages: prompts,
      });

      results.push({ file: filename, reply });
    } */
  }
}
