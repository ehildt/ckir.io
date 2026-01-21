<script setup lang="ts">
import { useMutation } from "@tanstack/vue-query";
import { computed } from "vue";

import { useVisionStore } from "../../store/use-vision/use-vision.store";

const vStore = useVisionStore();
const isDisabled = computed(() => {
  return vStore.ctx.vropts.task === "compare"
    ? vStore.atts.length < 2 && !vStore.ctx.vropts.prompt
    : vStore.atts.length === 0 && !vStore.ctx.vropts.prompt;
});

const { mutateAsync } = useMutation({
  mutationKey: ["vision"],
  networkMode: "online",
  mutationFn: async () => {
    const batchId = Date.now().toString();
    const url = new URL(import.meta.env.VITE_VISIONS_URL);
    url.searchParams.set("stream", vStore.ctx.vropts.stream.toString());
    url.searchParams.set("roomId", vStore.ctx.sropts.room);
    url.searchParams.set("numCtx", "32000");
    url.searchParams.set("batchId", batchId);

    const formData = new FormData();
    formData.append("task", vStore.ctx.vropts.task);
    formData.append("prompt", vStore.ctx.vropts.prompt ?? "");

    if (!vStore.atts.length && !vStore.ctx.vropts.prompt)
      throw new Error("At least one image or a prompt is required");

    for (const att of vStore.atts) {
      formData.append("images", att.file!, att.file!.name);
      vStore.replace(
        "atts",
        {
          ...att,
          batchId,
          status: "pending",
          hash: `${att.hash}_${batchId}`,
        },
        (vA, vB) => vB.hash!.includes(vA.hash!),
      );
    }

    const res = await fetch(url, {
      method: "POST",
      body: formData,
      headers: {
        "x-vision-llm": vStore.ctx.vropts.visionAgent,
      },
    });

    if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
    vStore.setPrompt();
  },
});
</script>

<template>
  <button
    :class="[
      'cursor-pointer flex',
      { 'text-lime-500/40': !isDisabled },
      { 'text-zinc-500/40': isDisabled },
    ]"
    :disabled="isDisabled"
    @click="() => mutateAsync()"
  >
    <span class="icon-[icon-park-outline--inbox-upload-r] size-8" />
  </button>
</template>
