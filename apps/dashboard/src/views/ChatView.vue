<script setup lang="ts">
import MarkdownIt from "markdown-it";

import { useSocketIo } from "../composables/use-socketio/use-socketio";
import ChatLayout from "../layouts/ChatLayout.vue";
import { useVisionStore } from "../store/use-vision/use-vision.store";
import AttachmentList from "../widgets/attachment-list/AttachmentList.vue";
import ChatTextWidget from "../widgets/chatbox/ChatBox.vue";
import ChatHeader from "../widgets/ChatHeader.vue";
const store = useVisionStore();
const { state } = useSocketIo();
const md = new MarkdownIt({
  html: true,
  linkify: true,
  breaks: true,
});
</script>

<template>
  <ChatLayout>
    <template #header>
      <ChatHeader />
    </template>

    <template #sidebar-left>
      <div class="bg-white/30 h-full rounded-sm select-none">Sidebar</div>
    </template>

    <template #sidebar-right>
      <AttachmentList
        :is-pending="store.isPending"
        class="bg-white/30 rounded-sm select-none"
        :attachments="store.attachments"
        @on-cancel="store.removeAttachment"
      />
    </template>

    <template #main>
      <div
        class="bg-white/30 h-full rounded-sm select-text p-5 overflow-y-scroll scrollbar-hide flex gap-1 flex-col"
      >
        <div v-for="(msg, index) in state?.messages" :key="index" class="bg-white/60 rounded-sm">
          <div>
            <h1>Image {{ msg.hash }} {{ msg.jobId }} {{ msg.pid }}</h1>
            <div class="w-full h-full p-1" v-html="md.render(msg.value.content)" />
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <ChatTextWidget class="bg-white/30 rounded-sm select-none" />
    </template>
  </ChatLayout>
</template>
