import { Body, PipeTransform } from '@nestjs/common';

import { MultipartFieldPipe } from '@/pipes/multipart-field.pipe';
import {
  MultipartFilesPipe,
  MultipartFilesPipeOptions,
} from '@/pipes/multipart-files.pipe';

export const TaskParam = ['describe', 'compare', 'ocr'];

export const MultiPartFiles = (
  options: MultipartFilesPipeOptions,
  ...pipes: Array<PipeTransform>
) =>
  Body(
    options?.fieldName,
    new MultipartFieldPipe(),
    new MultipartFilesPipe(options),
    ...pipes,
  );

export const MultiPartValue = (field: string, ...pipes: Array<PipeTransform>) =>
  Body(field, new MultipartFieldPipe(), ...pipes);
