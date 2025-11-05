<script setup lang="ts">
const props = defineProps<{ active: boolean }>();
</script>

<template>
  <div class="relative h-full w-full">
    <slot name="content" />
    <div
      :class="[
        props.active
          ? 'opacity-100 pointer-events-auto cursor-pointer animate-pulse'
          : 'opacity-0 pointer-events-none',
        'absolute inset-0 flex items-center justify-center',
        'rounded-sm transition-opacity duration-300 bg-black/50',
      ]"
    >
      <slot name="overlay" />
    </div>
  </div>
</template>
