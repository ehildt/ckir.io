import { OllamaService } from '@ckir.io/ollama';
import {
  BadRequestException,
  Controller,
  ParseArrayPipe,
  ParseBoolPipe,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiProperty, ApiTags } from '@nestjs/swagger';

import { OllamaConfigService } from '@/configs/ollama-config.service';
import {
  ApiBodyFileMultipart,
  ApiQueryFocus,
  ApiQueryPrompts,
  ApiQueryStream,
} from '@/decorators/visions.decorator';

export class UploadFileDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Upload an image (PNG/JPG/JPEG/WEBP)',
  })
  file: any;
}

@ApiTags('Images')
@Controller('images')
export class ImagesController {
  constructor(
    private readonly ollamaService: OllamaService,
    private readonly ollamaConfigService: OllamaConfigService,
  ) {}
  @Post('upload')
  @ApiConsumes('multipart/form-data', 'image/webp')
  @ApiBodyFileMultipart()
  @ApiQueryStream()
  @ApiQueryFocus()
  @ApiQueryPrompts()
  @ApiBody({ type: () => UploadFileDto, isArray: false })
  async uploadFile(
    @Req() req: any,
    @Query('stream', new ParseBoolPipe()) stream: boolean,
    @Query('focus', new ParseBoolPipe()) inFocus: boolean,
    @Query(
      'prompts',
      new ParseArrayPipe({ expectedType: String, optional: true }),
    )
    prompts: Array<string>,
  ) {
    const file = await req.file();
    if (!file) throw new BadRequestException('No file uploaded');
    if (!file.mimetype?.match(/image\/(png|jpg|jpeg|webp)/))
      throw new BadRequestException('Only PNG/JPG/JPEG/WEBP allowed');

    const buffer = await file.toBuffer();
    const base64 = buffer.toString('base64');
    const additionalPrompts =
      prompts?.map((content) => ({
        role: 'user',
        content,
      })) ?? [];

    if (inFocus)
      additionalPrompts.push({
        role: 'user',
        content:
          'Describe only the main subject that is in focus — ignore everything else.',
      });

    const reply = await this.ollamaService.chat({
      stream,
      keep_alive: this.ollamaConfigService.xOllamaConfig.keepAlive,
      model: this.ollamaConfigService.xOllamaConfig.x_options.visionModel,
      messages: [
        {
          role: 'system',
          content: `You are a vision-to-text model. 
          Describe images objectively and comprehensively, including visible text, 
          interface elements, layout, language, and context. 
          Output only structured factual descriptions, with no explanations, opinions, 
          or extra commentary.`,
        },
        {
          role: 'user',
          images: [base64],
          content: `Describe the image in full detail for automated processing.`,
        },
        ...additionalPrompts,
      ],
    });

    return reply;
  }
}
