import type { MultipartFile } from '@fastify/multipart';
import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

type Maybe<T> = T | ReadonlyArray<T> | undefined | null;

type Options = {
  fieldName: string;
  required?: boolean;
  minFiles?: number;
  maxFiles?: number;
  allowedMimeTypes?: ReadonlyArray<string>;
};

@Injectable()
export class MultipartFilesPipe implements PipeTransform<
  Maybe<MultipartFile>,
  ReadonlyArray<MultipartFile>
> {
  constructor(private opt: Readonly<Options>) {}

  transform(value: Maybe<MultipartFile>): ReadonlyArray<MultipartFile> {
    const {
      fieldName,
      required = true,
      minFiles = required ? 1 : 0,
      maxFiles,
      allowedMimeTypes,
    } = this.opt;

    const files = (
      Array.isArray(value) ? value : value ? [value] : []
    ) as ReadonlyArray<MultipartFile>;
    if (!required && files.length === 0) return [];

    if (required && files.length === 0)
      throw new BadRequestException(`Missing ${fieldName}`);

    if (files.length < minFiles)
      throw new BadRequestException(
        `Expected at least ${minFiles} file(s) in ${fieldName}`,
      );

    if (maxFiles != null && files.length > maxFiles)
      throw new BadRequestException(
        `Expected at most ${maxFiles} file(s) in ${fieldName}`,
      );

    if (allowedMimeTypes?.length) {
      const allow = new Set(allowedMimeTypes.map((m) => m.toLowerCase()));
      const bad = files.find(
        (f) => !allow.has((f.mimetype ?? '').toLowerCase()),
      );

      if (bad)
        throw new BadRequestException(
          `Invalid file type for ${fieldName}: ${bad.mimetype}`,
        );
    }

    return files;
  }
}
