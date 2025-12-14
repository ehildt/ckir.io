import { hashPayload } from '@ehildt/ckir-helpers';
import { FastifyRequest } from 'fastify';

export type FastifyMultipartMeta = {
  name: string;
  type: string;
  hash: string;
};

export type VisionTask = 'describe' | 'compare' | 'ocr';

type FastifyMultipartFilter = {
  roomId: string;
  stream: boolean;
  prompt: string;
  groupId: string;
  aiLLM: string;
  task: VisionTask;
};

export type FastifyMultipartDataWithFilters = {
  buffers: Array<Buffer>;
  meta: Array<FastifyMultipartMeta>;
  filters: Partial<FastifyMultipartFilter>;
};

type FastifyMultipartFilterFields =
  | 'task'
  | 'room'
  | 'stream'
  | 'prompt'
  | 'files'
  | 'groupId'
  | 'aiLLM'
  | 'visionAgent';

const FILTER_FIELDS: Array<FastifyMultipartFilterFields> = [
  'task',
  'room',
  'stream',
  'prompt',
  'files',
  'groupId',
  'aiLLM',
  'visionAgent',
];

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
  let fileData: FileData = {};
  let filters: Partial<FastifyMultipartFilter> = {};

  for await (const part of req.parts()) {
    filters = Object.assign(filters, getFilterFromFastifyMultipart(part));
    fileData = Object.assign(
      fileData,
      await getFileDataFromFastifyMultipart(part),
    );
  }

  const fD = Object.values(fileData);
  const buffers = fD.map(({ buffer }) => buffer);
  const meta: Array<FastifyMultipartMeta> = fD.map((d) => ({
    name: d.name,
    type: d.type,
    hash: `${hashPayload(d.buffer, 'sha256')}_${filters.groupId}`,
  }));

  return {
    meta,
    buffers,
    filters,
  };
}

type FileData = Record<string, { name: string; type: string; buffer: Buffer }>;

async function getFileDataFromFastifyMultipart(part: any) {
  const data: FileData = {};
  const field = part.fieldname;
  if (FILTER_FIELDS.includes(field) && part.file != null) {
    const filename = part.filename;
    data[filename] = {
      name: filename,
      type: part.mimetype,
      buffer: await part.toBuffer(),
    };
  }

  return data;
}

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
