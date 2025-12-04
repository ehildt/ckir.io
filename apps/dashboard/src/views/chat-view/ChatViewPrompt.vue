<script setup lang="ts">
import { safeHtml } from "./chat-view.helper";

defineProps<{ prompt: string; pulse?: boolean; label: string }>();
</script>

<template>
  <div class="relative bg-neutral-800 rounded-sm border">
    <span
      :class="[{ 'animate-pulse': pulse }]"
      class="absolute -top-2 right-3 px-1 text-xs text-yellow-500 select-none bg-transparent font-bold"
    >
      {{ label }}
    </span>

    <div class="p-3 px-4 text-zinc-400" v-html="safeHtml(prompt)" />
  </div>
</template>
