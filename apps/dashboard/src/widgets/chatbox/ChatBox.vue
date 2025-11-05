<script setup lang="ts">
import { useMutation } from "@tanstack/vue-query";
import { computed } from "vue";

import InputAttachments from "../../elements/inputs/InputAttachments.vue";
import { useVisionStore } from "../../store/use-vision/use-vision.store";
import VisionsModeMenu from "./VisionsModeMenu.vue";

const visionStore = useVisionStore();
const isDisabled = computed(() => visionStore.attachments.length === 0);
const { mutateAsync } = useMutation({
  mutationKey: ["vision"],
  networkMode: "online",
  mutationFn: async () => {
    if (!visionStore.attachments.length) throw new Error("No files added");
    const body = visionStore.buildFormData();
    const res = await fetch(import.meta.env.VITE_VISIONS_URL, { method: "POST", body });
    if (res.ok) visionStore.setPending(true);
    if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
  },
});
</script>

<template>
  <div class="h-full rounded-sm">
    <div class="flex gap-1 flex-col p-5">
      <VisionsModeMenu class="p-1 bg-white/60 rounded-sm w-full" />
      <div class="flex items-center gap-4 mt-1 p-5 bg-white/60 rounded-sm">
        <InputAttachments
          class="text-blue-600 pt-1.5"
          @attachments="visionStore.appendAttachment"
        />
        <textarea
          class="border-b-2 w-full resize-none outline-0 text-center placeholder:text-center text-pretty overflow-y-scroll scrollbar-hide"
          placeholder="What's on the agenda today?"
        />
        <button
          :class="['cursor-pointer flex', !isDisabled ? 'text-green-800' : 'text-gray-700']"
          type="button"
          :disabled="isDisabled"
          aria-label="Send"
          @click="() => mutateAsync()"
        >
          <span v-tooltip="'send'" class="icon-[ri--apps-ai-line] size-8" aria-label="send" />
        </button>
      </div>
    </div>
  </div>
</template>
