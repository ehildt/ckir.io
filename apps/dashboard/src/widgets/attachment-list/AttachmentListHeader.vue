<script setup lang="ts">
defineProps<{ size: number; label: string }>();
</script>

<template>
  <div class="bg-black/30 px-1.5 py-2 rounded-sm flex gap-4 w-full">
    <span class="icon-[streamline-sharp--email-attachment-image-remix] size-6 text-rose-600" />
    <p class="text-zinc-400 font-bold">{{ label }} ({{ size }})</p>
  </div>
</template>
