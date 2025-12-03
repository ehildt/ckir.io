<script setup lang="ts">
import { useMutation } from "@tanstack/vue-query";
import { computed, ref } from "vue";

import InputAttachments from "../../elements/inputs/InputAttachments.vue";
import { useVisionStore } from "../../store/use-vision/use-vision.store";
import VisionsModeMenu from "./VisionsModeMenu.vue";

const vStore = useVisionStore();
const isDisabled = computed(() => vStore.atts.length === 0);
const prompt = ref("");
const { mutateAsync } = useMutation({
  mutationKey: ["vision"],
  networkMode: "online",
  mutationFn: async () => {
    if (!vStore.atts.length) throw new Error("No files added");
    const formData = new FormData();
    formData.append("llm", vStore.ctx.vropts.llm);
    formData.append("room", vStore.ctx.sropts.room);
    formData.append("stream", vStore.ctx.vropts.stream.toString());
    formData.append("task", vStore.ctx.vropts.task);
    if (prompt.value && prompt.value !== "") formData.append("prompt", prompt.value);

    for (const vision of vStore.atts) {
      if ((vision.file as File).type === "mock") continue;
      if (vision.status !== "done") {
        formData.append("files", vision.file as File, (vision.file as File).name);
        vStore.patchAtts({ file: vision.file, status: "pending", text: "" });
      }
    }

    const res = await fetch(import.meta.env.VITE_VISIONS_URL, { method: "POST", body: formData });
    if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
    vStore.setPrompt(prompt.value);
    prompt.value = "";
  },
});
</script>

<template>
  <div class="h-full rounded-sm mt-5">
    <div class="flex gap-1 flex-col">
      <VisionsModeMenu class="p-1 bg-white/60 rounded-sm w-full" />
      <div class="flex items-center gap-4 mt-0.5 p-2 bg-white/60 rounded-sm">
        <InputAttachments class="text-blue-600 pt-1.5" />
        <input
          v-model.lazy="prompt"
          class="w-full outline-0 text-center placeholder:text-center text-pretty overflow-y-scroll scrollbar-hide"
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
