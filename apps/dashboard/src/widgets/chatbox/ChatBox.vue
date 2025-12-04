<script setup lang="ts">
import ChatBoxButton from "./ChatBoxButton.vue";
import ChatBoxFileInput from "./ChatBoxFileInput.vue";
import ChatBoxMenu from "./ChatBoxMenu.vue";
import ChatBoxTextarea from "./ChatBoxTextarea.vue";
</script>

<template>
  <div class="rounded-sm my-4">
    <ChatBoxMenu verbose class="mb-4" />
    <div class="flex items-center gap-4 mt-0.5 py-6.5 px-8 bg-black/30 rounded-sm">
      <ChatBoxFileInput class="text-blue-500/50 pt-1.5" />
      <ChatBoxTextarea placeholder="Hey, what's up buddy?.." label="OPTIONAL" pulse />
      <ChatBoxButton />
    </div>
  </div>
</template>
