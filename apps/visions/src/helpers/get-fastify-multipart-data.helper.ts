import { BadRequestException } from '@nestjs/common';
import { FastifyRequest } from 'fastify';

type FastifyMultipartMeta = Array<{ filename: string; mimetype: string }>;

type FastifyMultipartFilters = {
  stream: boolean;
  focus: boolean;
  prompt: string;
  vectorize: boolean;
  sharedContext: boolean;
};

function getFiltersFromFastifyMultipart(part: any): FastifyMultipartFilters {
  let stream: boolean;
  let focus: boolean;
  let prompt: string;
  let vectorize: boolean;
  let sharedContext: boolean;
  // part value means its a regular field
  if (part.value && part.fieldname === 'focus') focus = part.value === 'true';
  if (part.value && part.fieldname === 'prompt') prompt = part.value;
  if (part.value && part.fieldname === 'stream') stream = part.value === 'true';
  if (part.value && part.fieldname === 'vectorize')
    vectorize = part.value === 'true';
  if (part.value && part.fieldname === 'sharedContext')
    sharedContext = part.value === 'true';

  return {
    stream,
    focus,
    prompt,
    vectorize,
    sharedContext,
  };
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
  let filters: FastifyMultipartFilters;

  for await (const part of parts) {
    // part file means its a file
    if (part.file) {
      buffers.push(await part.toBuffer());
      meta.push({
        filename: part.filename,
        mimetype: part.mimetype,
      });
    }

    filters = getFiltersFromFastifyMultipart(part);
  }

  return {
    meta,
    buffers,
    filters,
  };
}
