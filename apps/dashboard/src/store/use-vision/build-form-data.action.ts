import type { VisionState } from "./use-vision.model";

export function buildFormData(this: VisionState) {
  const formData = new FormData();
  formData.append("llm", this.llm);
  formData.append("room", this.room);
  formData.append("stream", this.stream.toString());
  formData.append("task", this.task);
  if (this.prompt && this.prompt !== "") formData.append("prompt", this.prompt);
  for (const file of this.attachments) formData.append("files", file, file.name);
  return formData;
}
