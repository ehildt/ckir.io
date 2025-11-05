<script setup lang="ts">
const props = defineProps<{ attachmentSize: number; label: string }>();
</script>

<template>
  <div class="flex gap-1 items-center w-full text-center">
    <span class="icon-[streamline-sharp--email-attachment-image-remix] size-6 text-rose-600" />
    <h1 class="font-bold md:hidden lg:block">{{ props.label }} ({{ props.attachmentSize }})</h1>
  </div>
</template>
