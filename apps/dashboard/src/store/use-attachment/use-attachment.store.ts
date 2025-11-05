import { defineStore } from "pinia";

type State = { attachments: Array<File> };

function set(this: State, attachments: Array<File>) {
  this.attachments = attachments.slice();
}

function append(this: State, attachments: Array<File>) {
  const merged = [...this.attachments, ...attachments];
  const byKey = new Map(merged.map((f) => [`${f.name}-${f.size}-${f.lastModified}`, f]));
  this.attachments = Array.from(byKey.values());
}

function remove(this: State, attachment: File) {
  this.attachments = this.attachments.filter(
    (f) => f.name !== attachment.name || f.type !== attachment.type,
  );
}

function get(this: State) {
  return (name: string) => this.attachments.find((f) => f.name === name);
}

export const useAttachmentStore = defineStore("attachments", {
  state: (): State => ({ attachments: [] }),
  actions: { set, append, remove },
  getters: {
    get,
  },
});
