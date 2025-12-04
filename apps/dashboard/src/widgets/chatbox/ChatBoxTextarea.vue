<script setup lang="ts">
import { computed } from "vue";

import { useVisionStore } from "../../store/use-vision/use-vision.store";

const vStore = useVisionStore();

defineProps<{ placeholder: string; pulse?: true; label: string }>();

const prompt = computed({
  get: () => vStore.ctx.vropts.prompt,
  set: (val: string) => vStore.setPrompt(val),
});

const onPromptInput = (e: Event) => {
  const target = e.target as HTMLTextAreaElement | null;
  if (!target) return;
  const cleaned = target.value.replace(/^\s+/, "");
  if (cleaned !== target.value) target.value = cleaned;
  prompt.value = cleaned;
};

const onSpaceKeydown = (e: KeyboardEvent) => {
  if (!prompt.value) e.preventDefault();
};
</script>

<template>
  <div class="w-full h-full flex relative">
    <span
      v-if="vStore.atts?.length"
      :class="[{ 'animate-pulse': pulse }]"
      class="absolute -top-2 right-3 px-1 text-xs text-yellow-500 select-none bg-transparent font-bold"
    >
      {{ label }}
    </span>

    <textarea
      v-model="prompt"
      :rows="1"
      :class="[
        'w-full h-10 rounded-md bg-black/20 border border-black',
        'px-3 py-2 text-sm leading-5 text-zinc-500 text-center ',
        'placeholder:text-center placeholder:text-gray-400',
        'focus:outline-none focus:ring-2 focus:ring-zinc-700 focus:border-zinc-700 ',
        'resize-none overflow-hidden',
      ]"
      :placeholder="placeholder"
      @keydown.enter.prevent
      @keydown.space="onSpaceKeydown"
      @input="onPromptInput"
    />
  </div>
</template>
