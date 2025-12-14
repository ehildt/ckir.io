import type { ChatResponse } from "./chat-response.model";

export type VisionPatch = Partial<Vision> & { file: Vision["file"] };
export type VisionTask = "describe" | "compare" | "ocr";
export type VisionList = "conv" | "dscs" | "cmps" | "ocrs" | "atts";
export type VisionStatus = "idle" | "pending" | "fetching" | "done";
export type VisionMessage = {
  role: "user" | "assistant";
  content: string;
};

export type Vision = {
  file?: File;
  hash?: string;
  groupId?: string;
  vRefs?: Array<Vision>;
  chunk?: ChatResponse;
  status: VisionStatus;
  message?: VisionMessage;
};

type SocketIORouteOpts = {
  room: string;
};

type VisionRequestOpts = {
  textAgent?: string;
  visionAgent: string;
  task: VisionTask;
  stream: boolean;
  prompt?: string;
};

export type ExcludeOmit<T, K extends PropertyKey> =
  T extends Record<PropertyKey, any> ? Omit<T, K> : Exclude<T, K>;

export type ViewTab = ExcludeOmit<VisionList, "atts">;

export type View = { tab: ViewTab };

type VisionRequestContext = {
  view: View;
  vropts: VisionRequestOpts;
  sropts: SocketIORouteOpts;
};

export type VisionState = {
  conv: Array<Vision>;
  atts: Array<Vision>;
  ocrs: Array<Vision>;
  cmps: Array<Vision>;
  dscs: Array<Vision>;
  ctx: VisionRequestContext;
};
