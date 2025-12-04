import type { ExcludeOmit, VisionList, VisionState, VisionTask } from "./use-vision.model";

export async function setTask(this: VisionState, task: VisionTask) {
  this.ctx.vropts.task = task;
}

export async function setTab(this: VisionState, tab: ExcludeOmit<VisionList, "atts">) {
  this.ctx.view.tab = tab;
}

export async function setPrompt(this: VisionState, prompt?: string) {
  this.ctx.vropts.prompt = prompt;
}
