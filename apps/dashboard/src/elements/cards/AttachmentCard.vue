<script setup lang="ts">
const props = defineProps<{ file: File }>();
const filename = props.file.name.split(".")[0]!;
</script>

<template>
  <div class="border-5 rounded-sm">
    <div class="flex gap-0.5 p-1 border-b-3">
      <div class="flex justify-center">
        <slot name="icon-left" />
      </div>
      <div class="flex-1 min-w-0">
        <p class="truncate p-1 text-pink-500">
          {{ filename }}
        </p>
      </div>
      <div class="hover:animate-pulse flex justify-center">
        <slot name="icon-right" />
      </div>
    </div>
    <div class="justify-items-center">
      <slot name="card" />
    </div>
  </div>
</template>
