<script setup lang="ts">
const props = defineProps<{ file: File }>();
const filename = props.file.name.split(".")[0]!;
</script>

<template>
  <div class="border-black rounded-sm w-full border flex flex-col gap-px bg-white/20">
    <div class="flex gap-1 p-1 border-white bg-black/60">
      <div class="flex justify-center">
        <slot name="icon-left" />
      </div>
      <div class="flex-1 min-w-0 mr-10">
        <p class="self-center px-2 truncate text-pink-500">{{ filename }}</p>
      </div>
      <div class="hover:animate-pulse flex justify-center">
        <slot name="icon-right" />
      </div>
    </div>
    <div class="justify-items-center bg-black/60">
      <slot name="card" />
    </div>
  </div>
</template>
