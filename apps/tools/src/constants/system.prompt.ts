// Tool calling is model-dependent; not all models reliably emit native tool_calls.
// Strict system constraints (must use tool_calls, no JSON plans, no metadata prompts)
// significantly improve determinism.
// Runtime-only fields (e.g., call_id) should not be exposed in model-facing schemas.
// Users may explicitly reference tools in prompts, which often improves routing reliability.

import type { Message } from 'ollama';

// Tool-calling capability should be treated as a per-model feature when supporting multiple models.
export const SYSTEM_PROMPT: Message = {
  role: 'system',
  content: [
    'You may use the provided tools when needed.',
    'When you decide to use a tool, you MUST request it via native tool calling (populate tool_calls).',
    'Do NOT write a tool plan, do NOT output JSON, and do NOT put tool selections in message content.',
    'Do NOT ask the user for call_id or any execution metadata; the runtime will handle that.',
    'Tool routing rules:',
    '- Use "visions" for any image/file understanding: describe, compare, OCR, read text in an image, analyze screenshots/PDFs.',
    '- Use "vectors" only for embeddings/vectorization/semantic similarity over text/items.',
    '- If both are required, call "visions" first, then "vectors" using the text output from "visions".',
  ].join('\n'),
};
