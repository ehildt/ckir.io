import { Body, PipeTransform } from '@nestjs/common';

import {
  MultipartFilesPipe,
  MultipartFilesPipeOptions,
} from '@/pipes/multipart-files.pipe';

export const TaskParam = ['describe', 'compare', 'ocr'];

export const MultiPartFiles = (options: MultipartFilesPipeOptions) =>
  Body(options?.fieldName, new MultipartFilesPipe(options));

export const MultiPartValue = (field: string, ...pipes: Array<PipeTransform>) =>
  Body(field, ...pipes);
