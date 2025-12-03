<script setup lang="ts">
import type { Vision } from "../../store/use-vision/use-vision.model";
import { useVisionStore } from "../../store/use-vision/use-vision.store";
import { hashFile } from "./hash-file.helper";

const vStore = useVisionStore();

const handleFiles = async (e: Event) => {
  const t = e.target as HTMLInputElement;
  const files = await Promise.all(
    (t.files ? Array.from(t.files) : []).map(
      async (file) =>
        ({
          file,
          status: "idle",
          hash: await hashFile(file),
          text: "",
        }) satisfies Vision,
    ),
  );

  vStore.appendAtts(files);
  t.value = "";
};
</script>

<template>
  <div class="flex">
    <input id="attachments" type="file" multiple class="sr-only" @change="handleFiles" />
    <label
      for="attachments"
      class="cursor-pointer select-none"
      role="button"
      aria-label="Select Attachments"
      tabindex="0"
    >
      <span class="icon-[teenyicons--attachment-outline] size-8" />
    </label>
  </div>
</template>
