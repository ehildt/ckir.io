import { defineStore } from "pinia";

import { buildFormData } from "./build-form-data.action";
import { setPending } from "./set-pending.action";
import { setTask } from "./set-task.action";
import type { VisionState as State } from "./use-vision.model";

function setAttachments(this: State, attachments: Array<File>) {
  this.attachments = attachments.slice();
}

function appendAttachment(this: State, attachments: Array<File>) {
  const merged = [...this.attachments, ...attachments];
  const byKey = new Map(merged.map((f) => [`${f.name}-${f.size}-${f.lastModified}`, f]));
  this.attachments = Array.from(byKey.values());
}

function removeAttachment(this: State, attachment: File) {
  this.attachments = this.attachments.filter(
    (f) => f.name !== attachment.name || f.type !== attachment.type,
  );
}

function getAttachment(this: State) {
  return (name: string) => this.attachments.find((f) => f.name === name);
}

export const useVisionStore = defineStore("visions", {
  state: (): State => ({
    llm: "gemma3:27b",
    room: "pipiaa",
    stream: true,
    isPending: false,
    prompt: "",
    task: "describe",
    results: [],
    attachments: [],
  }),

  actions: {
    buildFormData,
    setTask,
    setPending,
    removeAttachment,
    appendAttachment,
    setAttachments,
  },
  getters: {
    getAttachment,
  },
});
