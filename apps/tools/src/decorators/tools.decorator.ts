import { Body } from '@nestjs/common';
import { ApiBody, ApiParam } from '@nestjs/swagger';

import { MultipartFieldPipe } from '@/pipes/multipart-field.pipe';
import { MultipartFilesPipe } from '@/pipes/multipart-files.pipe';

export const TaskParam = ['tool'];

export const ApiTaskParam = () =>
  ApiParam({
    name: 'task',
    type: 'string',
    enum: TaskParam,
  });

export const ApiBodySchema = () =>
  ApiBody({
    schema: {
      type: 'object',
      required: ['prompt'],
      properties: {
        prompt: {
          type: 'string',
          example: '',
          description: 'Text prompt (required)',
        },
        files: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
          description: 'Optional file uploads (0..N)',
          nullable: true,
        },
      },
    },
  });

export const MultiPartFiles = (field: string) =>
  Body(
    field,
    new MultipartFilesPipe({
      minFiles: 1,
      required: false,
      fieldName: field,
      allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp'],
    }),
  );

export const MultiPartValue = (field: string) =>
  Body(field, new MultipartFieldPipe());
