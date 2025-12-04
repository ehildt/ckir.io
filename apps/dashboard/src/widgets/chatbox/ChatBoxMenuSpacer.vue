<script setup lang="ts">
import { computed } from "vue";

import type { ViewTab, VisionTask } from "../../store/use-vision/use-vision.model";

defineProps<{ tab: ViewTab; task: VisionTask }>();

const tabMap = computed(
  () =>
    ({
      conv: "conversation",
      dscs: "descriptions",
      cmps: "comparisons",
      ocrs: "ocrs",
    }) as const,
);
const pillClass =
  "text-center flex h-6 min-w-30 justify-center rounded-full bg-black/30 text-zinc-500 line-h-normal";
</script>

<template>
  <div class="z-10 flex items-center">
    <span :class="pillClass" class="leading-normal line-h-normal">{{ tabMap[tab] }}</span>
    <span class="icon-[material-symbols--line-curve-rounded] rotate-45 text-zinc-500 size-8" />
    <span class="glitch-svg icon-[arcticons--ai-chat] size-8 rotate-90 text-zinc-500" />
    <span class="icon-[material-symbols--line-curve-rounded] rotate-225 text-zinc-500 size-8" />
    <span :class="pillClass">{{ task }}</span>
  </div>
</template>

<style>
.glitch-svg {
  animation: glitch-jitter 2000ms alternate steps(2, end);
}

@keyframes glitch-jitter {
  0% {
    transform: translate(0, 0) rotate(0, 0);
  }
  20% {
    transform: translate(-1px, 1px);
  }
  40% {
    transform: translate(1px, -1px);
  }
  60% {
    transform: translate(-1px, 0);
  }
  80% {
    transform: translate(1px, 1px);
  }
  100% {
    transform: translate(0, 0) rotate(360, 360);
  }
}
</style>
