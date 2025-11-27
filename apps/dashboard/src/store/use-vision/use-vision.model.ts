import type { ChatResponse } from "./chat-response.model";

/**
 * Supported vision tasks for this pipeline.
 * - "describe": produce textual descriptions/captions
 * - "compare": compare multiple images
 * - "ocr": extract text from images
 */
export type VisionTask = "describe" | "compare" | "ocr";

/**
 * Lifecycle status for a vision job.
 */
export type VisionStatus = "idle" | "pending" | "fetching" | "done";

/**
 * Represents a single vision-related item (attachment, OCR result,
 * comparison result, or description) and its processing state.
 */
export type Vision = {
  /** Original file associated with this vision item. */
  file: File;
  /** Content hash used to identify and de-duplicate the file. */
  hash: string;
  /** Current processing status of this vision item. */
  status: VisionStatus;
  /** Optional extracted or generated text associated with the item. */
  text?: string;
  /** Optional full model response chunk associated with this item. */
  chunk?: ChatResponse;
};

/**
 * Routing options for Socket.IO, used so the server knows
 * which room to send the response back to.
 */
type SocketIORouteOpts = {
  /**
   * Socket.IO room identifier used to route the server response.
   */
  room: string;
};

/**
 * Options for how the vision model should be invoked.
 */
type VisionRequestOpts = {
  /** Identifier of the underlying LLM / vision model to call. */
  llm: string;
  /** High-level vision task to perform (describe, compare, ocr). */
  task: VisionTask;
  /** Whether the response should be streamed incrementally. */
  stream: boolean;
  /** Optional user prompt or instruction to guide the vision task. */
  prompt?: string;
};

/**
 * Context for a vision request, combining model invocation options
 * with transport-level routing information.
 */
type VisionRequestContext = {
  /**
   * Options for performing vision model requests
   * (e.g. model name, task type, streaming, prompt).
   */
  vropts: VisionRequestOpts;

  /**
   * Routing options for Socket.IO-based responses,
   * typically containing the room that should receive
   * the server's emitted result.
   */
  sropts: SocketIORouteOpts;
};

/**
 * Represents the full state used for vision-related processing,
 * including request context and grouped vision items by role.
 */
export type VisionState = {
  /** Combined vision request options and routing metadata. */
  ctx: VisionRequestContext;

  /**
   * Vision items that represent the original attachments
   * provided by the user (raw input images/files).
   */
  atts: Array<Vision>;

  /**
   * Vision items that represent OCR (Optical Character Recognition)
   * results extracted from attachments or other images.
   */
  ocrs: Array<Vision>;

  /**
   * Vision items that represent comparison results between images,
   * such as similarity, differences, or ranking.
   */
  cmps: Array<Vision>;

  /**
   * Vision items that represent textual descriptions of images,
   * such as captions, summaries, or structured annotations.
   */
  dscs: Array<Vision>;
};
