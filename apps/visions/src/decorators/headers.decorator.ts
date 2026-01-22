import { SetMetadata } from '@nestjs/common';

export const CONDITIONAL_HEADER_KEY = 'require_llm_header';

export const ConsumesHeader = (headerName: string) =>
  SetMetadata(CONDITIONAL_HEADER_KEY, headerName);
