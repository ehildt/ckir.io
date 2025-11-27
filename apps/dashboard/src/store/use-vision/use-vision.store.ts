import { defineStore } from "pinia";

import type { Vision, VisionState, VisionTask } from "./use-vision.model";

export const useVisionStore = defineStore("visions", {
  state: (): VisionState => ({
    ctx: {
      sropts: {
        room: "foo@bar.com",
      },
      vropts: {
        llm: "gemma3:12b",
        stream: true,
        prompt: undefined,
        task: "describe",
      },
    },
    atts: [],
    ocrs: [],
    cmps: [],
    dscs: [],
  }),
  actions: {
    patch,
    append,
    remove,
    replace,
    setTask,
    setPrompt,
  },
});

function fileComparator(fA: File, fB: File) {
  return fA.name === fB.name && fA.type === fB.type && fA.lastModified === fB.lastModified;
}

function append(this: VisionState, visions: Array<Vision> | Vision) {
  if (!Array.isArray(visions)) this.atts.push(visions);
  else this.atts = this.atts.concat(visions);
}

function remove(this: VisionState, visions: Vision | Vision[]) {
  const toRemove = Array.isArray(visions) ? visions : [visions];
  this.atts = this.atts.filter((vA) => !toRemove.some((vB) => fileComparator(vA.file, vB.file)));
}

function replace(this: VisionState, visions: Vision | Vision[]) {
  const toReplace = Array.isArray(visions) ? visions : [visions];
  this.atts = this.atts.map((vA) => {
    const exists = toReplace.find((vB) => fileComparator(vB.file, vA.file));
    return exists ? exists : vA;
  });
}

function patch(this: VisionState, partial: Partial<Vision> & { file: Vision["file"] }) {
  const match = this.atts.find((v) => fileComparator(v.file, partial.file));
  if (match) Object.assign(match, partial);
}

async function setTask(this: VisionState, task: VisionTask) {
  this.ctx.vropts.task = task;
}

async function setPrompt(this: VisionState, prompt: string) {
  this.ctx.vropts.prompt = prompt;
}
