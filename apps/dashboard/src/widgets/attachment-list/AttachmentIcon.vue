<script setup lang="ts">
import { ICON_MAP, type MapIcon } from "./attachment-icon.helper";
defineProps<{ type: string }>();
</script>

<template>
  <span :class="ICON_MAP.get(type as MapIcon)" />
</template>
