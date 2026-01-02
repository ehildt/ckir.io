<script setup lang="ts">
import { useMutation } from "@tanstack/vue-query";
import { computed } from "vue";

import { useVisionStore } from "../../store/use-vision/use-vision.store";
import { hashText } from "./hash-text.helper";

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
    const groupId = Date.now().toString();
    const formData = new FormData();
    formData.append("visionAgent", vStore.ctx.vropts.visionAgent);
    if (vStore.ctx.vropts.textAgent) formData.append("textAgent", vStore.ctx.vropts.textAgent);
    formData.append("room", vStore.ctx.sropts.room);
    formData.append("stream", vStore.ctx.vropts.stream.toString());
    formData.append("task", vStore.ctx.vropts.task);

    if (!vStore.atts?.length) {
      formData.append("groupId", groupId);
    } else {
      for (const att of vStore.atts) {
        try {
          formData.append("groupId", groupId);
          formData.append("files", att.file!, att.file!.name);
          vStore.replace(
            "atts",
            {
              ...att,
              groupId,
              status: "pending",
              hash: `${att.hash}_${groupId}`,
            },
            (vA, vB) => vB.hash!.includes(vA.hash!),
          );
        } catch (error) {
          console.error(error);
          // toast error
        }
      }
    }

    if (vStore.ctx.vropts.prompt) {
      const messages = vStore.conv
        .map(({ message }) => message)
        .filter(Boolean)
        .concat([{ role: "user", content: vStore.ctx.vropts.prompt }]);
      vStore.append("conv", {
        hash: await hashText(vStore.ctx.vropts.prompt),
        groupId,
        status: "idle",
        message: { role: "user", content: vStore.ctx.vropts.prompt },
        chunk: {
          created_at: new Date(),
        } as any,
      });
      formData.append("prompt", JSON.stringify(messages));
    }

    const res = await fetch(import.meta.env.VITE_VISIONS_URL, {
      method: "POST",
      body: formData,
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
