import { OllamaService } from '@ehildt/ckir-ollama';
import { Controller, Post, Req } from '@nestjs/common';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FastifyRequest } from 'fastify';

import { OllamaConfigService } from '@/configs/ollama-config.service';
import { ApiBodyFileMultipart } from '@/decorators/visions.decorator';
import { getFastifyMultipartDataWithFilters } from '@/helpers/get-fastify-multipart-data.helper';

type Prompt = { role: string; content: string; images?: Buffer[] };

@ApiTags('Images')
@Controller('images')
export class ImagesController {
  constructor(
    private readonly ollamaService: OllamaService,
    private readonly ollamaConfigService: OllamaConfigService,
  ) {}

  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiBodyFileMultipart()
  async describeImages(@Req() req: FastifyRequest) {
    const { buffers, meta, filters } =
      await getFastifyMultipartDataWithFilters(req);
    const results = [];

    for (let i = 0; i < buffers.length; i++) {
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
    }

    return results;
  }
}
