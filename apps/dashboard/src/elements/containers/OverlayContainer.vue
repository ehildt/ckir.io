<script setup lang="ts">
const props = defineProps<{ active: boolean; pulse?: boolean }>();
</script>

<template>
  <div class="relative h-full w-full">
    <slot />
    <div
      :class="[
        { 'animate-pulse': props.pulse },
        { 'opacity-100 pointer-events-auto': props.active },
        'opacity-0 pointer-events-none h-full w-full',
        'absolute inset-0 flex items-center justify-center align-middle',
        'rounded-sm transition duration-300 bg-black/50',
      ]"
    >
      <slot name="overlay" />
    </div>
  </div>
</template>
