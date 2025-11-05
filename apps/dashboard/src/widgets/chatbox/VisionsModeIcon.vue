<script setup lang="ts">
import { computed } from "vue";

import type { VisionProps, VisionValue } from "./visions-mode.model";

const defaults = withDefaults(defineProps<VisionProps>(), {
  value: "describe",
  active: false,
});
const classes = computed(() => [
  defaults.active ? "text-purple-800" : "text-gray-600",
  "cursor-pointer items-center h-full w-full flex justify-center",
  "hover:animate-pulse",
]);
const emit = defineEmits<{
  (e: "onValueUpdated", value: VisionValue): void;
}>();
</script>

<template>
  <span
    v-tooltip="defaults.value"
    :class="classes"
    @click="() => emit('onValueUpdated', defaults.value)"
  >
    <slot />
  </span>
</template>
