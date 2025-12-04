<script setup lang="ts">
import type { Vision } from "../../store/use-vision/use-vision.model";
import ChatViewContent from "./ChatViewContent.vue";

defineProps<{ visions: Array<Vision> }>();
</script>

<template>
  <TransitionGroup
    tag="div"
    class="overflow-y-scroll scrollbar-hide flex gap-3 flex-col h-full"
    enter-active-class="transition-all duration-500 ease-out"
    leave-active-class="transition-all duration-300 ease-in"
    enter-from-class="opacity-0 translate-y-1"
    enter-to-class="opacity-100 translate-y-0"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 translate-y-1"
    move-class="transition-transform duration-150 ease-out"
  >
    <div
      v-for="(vision, index) in visions"
      :key="`${vision.groupId}_${index}`"
      class="flex flex-col gap-3 mt-2"
    >
      <ChatViewContent :vision="vision" />
    </div>
  </TransitionGroup>
</template>
