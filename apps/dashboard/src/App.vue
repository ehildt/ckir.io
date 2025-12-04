<script setup lang="ts">
import "./socketio/socketio.client";
import "./socketio/socketio.vision";

import ChatView from "./views/chat-view/ChatView.vue";
</script>

<template>
  <ChatView />
</template>

<style>
@import "./assets/css/styles.css";
</style>
