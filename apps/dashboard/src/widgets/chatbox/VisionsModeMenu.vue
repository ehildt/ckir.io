<script setup lang="ts">
import { ref } from "vue";

import { useVisionStore } from "../../store/use-vision/use-vision.store";
import type { VisionTask } from "./visions-mode.model";
import VisionsModeIcon from "./VisionsModeIcon.vue";

const vStore = useVisionStore();
const mode = ref<VisionTask>("describe");
const onVisionsModeUpdate = (m: VisionTask) => {
  mode.value = m;
  vStore.setTask(m);
};
</script>

<template>
  <div class="flex gap-1 align-middle">
    <span class="icon-[streamline--ai-chip-spark] size-8 text-red-500 ml-4 m-2 mr-auto" />
    <div class="ml-auto p-1 flex items-center gap-1 mr-3">Eugen's KI</div>
    <div class="ml-auto p-1 flex items-center gap-1 mr-3 max-w-fit">
      <VisionsModeIcon
        :active="vStore.ctx.vropts.task === 'describe'"
        value="describe"
        @on-value-updated="() => onVisionsModeUpdate('describe')"
      >
        <span class="icon-[carbon--chat] size-8" />
      </VisionsModeIcon>
      <VisionsModeIcon
        :active="vStore.ctx.vropts.task === 'compare'"
        value="compare"
        @on-value-updated="() => onVisionsModeUpdate('compare')"
      >
        <span class="icon-[ic--round-compare] size-8" />
      </VisionsModeIcon>
      <VisionsModeIcon
        :active="vStore.ctx.vropts.task === 'ocr'"
        value="ocr"
        @on-value-updated="() => onVisionsModeUpdate('ocr')"
      >
        <span class="icon-[lucide--scan-text] size-8" />
      </VisionsModeIcon>
    </div>
  </div>
</template>
