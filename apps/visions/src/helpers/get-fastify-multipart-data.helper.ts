import { BadRequestException } from '@nestjs/common';
import { FastifyRequest } from 'fastify';

type FastifyMultipartMeta = {
  filename: string;
  mimetype: string;
};

type FastifyMultipartFilter = {
  event: string;
  room: string;
  stream: boolean;
  prompt: string;
  llm: string;
  task: 'describe' | 'compare' | 'ocr';
};

export type FastifyMultipartDataWithFilters = {
  buffers: Array<Buffer>;
  meta: Array<FastifyMultipartMeta>;
  filters: Partial<FastifyMultipartFilter>;
};

type FastifyMultipartFilterFields =
  | 'task'
  | 'event'
  | 'room'
  | 'stream'
  | 'prompt'
  | 'llm';

const FILTER_FIELDS: Array<FastifyMultipartFilterFields> = [
  'task',
  'event',
  'room',
  'stream',
  'prompt',
  'llm',
];

function getFilterFromFastifyMultipart(
  part: any,
): Partial<FastifyMultipartFilter> {
  const filter: Partial<FastifyMultipartFilter> = {};
  const field = part.fieldname;
  if (FILTER_FIELDS.includes(field) && part.value != null) {
    if (part.value === 'true') {
      filter[field] = true;
    } else if (part.value === 'false') {
      filter[field] = false;
    } else {
      filter[field] = part.value;
    }
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
export async function getFastifyMultipartDataWithFilters(
  req: FastifyRequest,
): Promise<FastifyMultipartDataWithFilters> {
  const parts = req.parts() as any;
  if (parts.length === 0) throw new BadRequestException('No files uploaded');

  const buffers: Array<Buffer> = [];
  const meta: Array<FastifyMultipartMeta> = [];
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
