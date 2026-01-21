import { SetMetadata } from '@nestjs/common';

export const CONDITIONAL_HEADER_KEY = 'require_x_embedding_llm_header';

export const ConditionalHeader = (headerName: string) =>
  SetMetadata(CONDITIONAL_HEADER_KEY, headerName);
