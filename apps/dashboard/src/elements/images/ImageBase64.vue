<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from "vue";

const props = defineProps<{ file: File }>();
const url = ref<string>();

watch(
  () => props.file,
  (newFile) => {
    if (url.value) URL.revokeObjectURL(url.value);
    url.value = URL.createObjectURL(newFile);
  },
  { immediate: true },
);

onBeforeUnmount(() => {
  if (url.value) URL.revokeObjectURL(url.value);
});
</script>

<template>
  <img :src="url" :alt="props.file.name" />
</template>
