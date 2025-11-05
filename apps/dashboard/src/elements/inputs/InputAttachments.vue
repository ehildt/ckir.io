<script setup lang="ts">
import { ref } from "vue";

const files = ref<File[]>([]);
const emit = defineEmits<{
  (e: "attachments", files: Array<File>): void;
}>();

const handleFiles = (e: Event) => {
  const t = e.target as HTMLInputElement;
  files.value = t.files ? Array.from(t.files) : [];
  emit("attachments", files.value);
  t.value = "";
};
</script>

<template>
  <div class="flex">
    <input id="attachments" type="file" multiple class="sr-only" @change="handleFiles" />
    <label
      for="attachments"
      class="cursor-pointer select-none"
      role="button"
      aria-label="Select Attachments"
      tabindex="0"
    >
      <span class="icon-[teenyicons--attachment-outline] size-8" />
    </label>
  </div>
</template>
