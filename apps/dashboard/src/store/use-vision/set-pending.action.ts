import type { VisionState } from "./use-vision.model";

export async function setPending(this: VisionState, pending: boolean) {
  this.isPending = pending;
}
