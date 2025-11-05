import type { VisionState, VisionTask } from "./use-vision.model";

export async function setTask(this: VisionState, task: VisionTask) {
  this.task = task;
}
