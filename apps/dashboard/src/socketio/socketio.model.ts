import type { ChatResponse } from "../store/use-vision/chat-response.model";
import type { VisionTask } from "../store/use-vision/use-vision.model";

export type ClientToServerEvents = {
  joinRoom: (room: string, ack: (ok: boolean, error?: string) => void) => void;
  leaveRoom: (room: string, ack: (ok: boolean, error?: string) => void) => void;
};

export type ServerToClientEvents = {
  vision: (msg: VisionResponse) => void;
};

export type VisionResponseMeta = {
  name: string;
  type: string;
  hash: string;
  groupId: string;
};

export type VisionResponse = {
  task: VisionTask;
  meta: Array<VisionResponseMeta>;
} & ChatResponse;
