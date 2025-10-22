import { BadRequestException } from '@nestjs/common';
import { FastifyRequest } from 'fastify';

type FastifyMultipartMeta = Array<{ filename: string; mimetype: string }>;

type FastifyMultipartFilter = {
  stream: boolean;
  focus: boolean;
  prompt: string;
  vectorize: boolean;
  ocr: boolean;
};

type FastifyMultipartFilterBooleanFields =
  | 'focus'
  | 'stream'
  | 'vectorize'
  | 'ocr';

const BOOLEAN_FIELDS: Array<FastifyMultipartFilterBooleanFields> = [
  'focus',
  'stream',
  'vectorize',
  'ocr',
];

function getFilterFromFastifyMultipart(
  part: any,
): Partial<FastifyMultipartFilter> {
  const filter: Partial<FastifyMultipartFilter> = {};
  const field = part.fieldname;
  if (field === 'prompt' && part.value) {
    filter.prompt = part.value;
  } else if (BOOLEAN_FIELDS.includes(field) && part.value) {
    filter[field as FastifyMultipartFilterBooleanFields] =
      part.value === 'true';
  }

  return filter;
}

/**
 * Parses multipart form data from a FastifyRequest, including files and specific fields.
 *
 * This function currently casts `req.parts()` to `any` because `@fastify/multipart` does
 * not yet have full TypeScript type support for the `parts()` iterator.
 *
 * @param req - The incoming Fastify request containing multipart form data
 * @throws BadRequestException if no files are uploaded
 * @returns An object containing:
 *  - `meta`: Array of file metadata objects `{ filename, mimetype }`
 *  - `buffers`: Array of file contents as Buffers
 *  - `stream`: Boolean flag if 'stream' field is set to 'true'
 *  - `focus`: Boolean flag if 'focus' field is set to 'true'
 *  - `prompts`: Array of strings from the 'prompts' field, split by comma
 */
export async function getFastifyMultipartDataWithFilters(req: FastifyRequest) {
  const parts = req.parts() as any;
  if (parts.length === 0) throw new BadRequestException('No files uploaded');

  const meta: FastifyMultipartMeta = [];
  const buffers: Array<Buffer> = [];
  let filters: Partial<FastifyMultipartFilter> = {};

  for await (const part of parts) {
    // part.file means its a file
    if (part.file) {
      buffers.push(await part.toBuffer());
      meta.push({
        filename: part.filename,
        mimetype: part.mimetype,
      });
    }

    filters = Object.assign(filters, getFilterFromFastifyMultipart(part));
  }

  return {
    meta,
    buffers,
    filters,
  };
}
