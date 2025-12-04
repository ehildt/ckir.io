<script setup lang="ts">
import type { Vision } from "../../store/use-vision/use-vision.model";
import { useVisionStore } from "../../store/use-vision/use-vision.store";
import { hashFile } from "./hash-file.helper";

const vStore = useVisionStore();

const handleFiles = async (e: Event) => {
  const input = e.target as HTMLInputElement | null;
  if (!input?.files?.length) return;
  const visions: Vision[] = [];

  try {
    for (const file of Array.from(input.files)) {
      try {
        const hash = await hashFile(file);
        visions.push({ file, status: "idle", hash });
      } catch (err) {
        console.error("Failed to hash file:", file.name, err);
        // optionally: show toast here
      }
    }
    if (visions.length) vStore.append("atts", visions);
  } finally {
    input.value = "";
  }
};
</script>

<template>
  <div class="flex">
    <input
      id="chat_box_file_input"
      aria-label="chat_box_file_input"
      type="file"
      multiple
      class="sr-only"
      @change="handleFiles"
    />
    <label for="chat_box_file_input" class="cursor-pointer select-none" role="button" tabindex="0">
      <span class="icon-[fluent--attach-text-24-filled] size-8" />
    </label>
  </div>
</template>
