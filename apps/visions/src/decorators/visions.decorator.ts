import { Body } from '@nestjs/common';
import { ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';

import { MultipartFieldPipe } from '@/pipes/multipart-field.pipe';
import { MultipartFilesPipe } from '@/pipes/multipart-files.pipe';

export const TaskParam = ['describe', 'compare', 'ocr'];

export const ApiTaskParam = () =>
  ApiParam({
    name: 'task',
    enum: TaskParam,
    description: 'Task to perform on the input: describe, compare, or ocr',
  });

export const ApiBodySchema = () =>
  ApiBody({
    schema: {
      type: 'object',
      properties: {
        prompt: { type: 'string', example: '' },
        images: { type: 'array', items: { type: 'string', format: 'binary' } },
      },
      required: ['images'],
    },
  });

export const MultiPartFiles = (
  fieldName: string,
  allowedMimeTypes: Array<string>,
  required: boolean = true,
) =>
  Body(
    fieldName,
    new MultipartFilesPipe({
      required,
      minFiles: 1,
      fieldName,
      allowedMimeTypes,
    }),
  );

export const MultiPartValue = (field: string) =>
  Body(field, new MultipartFieldPipe());

export const ApiQueryStream = () =>
  ApiQuery({
    type: Boolean,
    required: false,
    name: 'stream',
    default: 'false',
    description:
      'Specifies whether the response should be streamed or returned as a single complete result.',
  });

export const ApiQueryFocus = () =>
  ApiQuery({
    type: Boolean,
    required: false,
    name: 'focus',
    default: 'false',
    description:
      'Will try to describe only the main subject that is in focus and ignore everything else.',
  });

export const ApiQueryPrompts = () =>
  ApiQuery({
    name: 'prompts',
    type: String,
    isArray: true,
    required: false,
    description: 'Array of string prompts',
  });
