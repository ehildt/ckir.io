<script setup lang="ts">
// turn it into a plugin for vite/vue
import "./socketio/socketio.client";
import "./socketio/socketio.vision";

import ChatView from "./views/ChatView.vue";
</script>

<template>
  <ChatView />
</template>

<style>
@import "./assets/css/styles.css";
</style>
