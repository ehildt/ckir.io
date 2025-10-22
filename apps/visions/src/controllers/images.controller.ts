import { OllamaService } from '@ehildt/ckir-ollama';
import { Controller, Post, Req } from '@nestjs/common';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FastifyRequest } from 'fastify';

import { OllamaConfigService } from '@/configs/ollama-config.service';
import { ApiBodyFileMultipart } from '@/decorators/visions.decorator';
import { getFastifyMultipartDataWithFilters } from '@/helpers/get-fastify-multipart-data.helper';

type Prompt = { role: string; content: string; images?: any };

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

    const prompts: Array<Prompt> = [];

    // Add user-provided prompt if exists
    if (filters.prompt) {
      prompts.push({
        role: 'user',
        content: filters.prompt,
      });
    }

    // Vision-based description prompt (only if OCR is not requested)
    if (!filters.ocr) {
      const visionContent: string[] = [
        `You are a vision-to-text model: for each image, provide detailed, 
        objective descriptions including visible text, typography, interface elements, 
        layout, composition, spatial relationships, language, and contextual information; 
        the images may depict the same subject, scene, or share similar content; 
        include only explicitly visible information unless the user requests otherwise; 
        output strictly factual descriptions without opinions, explanations, or extra commentary.`,
        `Files: ${meta.map((m) => m.filename).join(', ')}`,
      ];

      if (filters.focus) visionContent.push('Focus only on the main subject.');

      prompts.push({
        role: 'assistant',
        content: visionContent.join('\n'),
        images: buffers,
      });
    }

    // OCR prompt
    if (filters.ocr) {
      prompts.push({
        role: 'assistant',
        images: buffers,
        content: `You are an OCR assistant. Extract all text from the provided image(s). 
        Return only the raw text content. Do not add explanations, comments, or warnings.`,
      });
    }

    const reply = await this.ollamaService.chat({
      stream: filters.stream,
      keep_alive: this.ollamaConfigService.xOllamaConfig.keepAlive,
      model: this.ollamaConfigService.xOllamaConfig.x_options.visionModel,
      messages: prompts,
    });

    return reply;
  }
}
