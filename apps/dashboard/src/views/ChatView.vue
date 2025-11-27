<script setup lang="ts">
import { formatDistanceToNow } from "date-fns";
import MarkdownIt from "markdown-it";

import ChatLayout from "../layouts/ChatLayout.vue";
import { useVisionStore } from "../store/use-vision/use-vision.store";
import AttachmentList from "../widgets/attachment-list/AttachmentList.vue";
import ChatTextWidget from "../widgets/chatbox/ChatBox.vue";

const vStore = useVisionStore();

const md = new MarkdownIt({
  html: true,
  linkify: true,
  breaks: true,
});
</script>

<template>
  <ChatLayout>
    <template #sidebar-left>
      <div :class="['bg-white/30', 'h-full', 'rounded-sm', 'select-none']">Sidebar</div>
    </template>

    <template #sidebar-right>
      <AttachmentList :class="['bg-white/30', 'rounded-sm', 'select-none']" />
    </template>

    <template #main>
      <div
        :class="[
          'bg-white/30',
          'h-full',
          'rounded-sm',
          'select-text',
          'p-5',
          'flex',
          'flex-col',
          'gap-1',
        ]"
      >
        <nav :class="['bg-white/50', 'rounded-sm', 'p-1.5']">some nav header menu here</nav>
        <div class="overflow-y-scroll scrollbar-hide flex gap-1 flex-col-reverse">
          <div v-for="vision in vStore.atts" :key="vision.file?.name">
            <div v-if="vision.text" :class="['rounded-sm', 'p-1 flex gap-0.5 flex-col bg-white']">
              <div class="flex items-center p-2 pl-5 pr-5 bg-black rounded-t-sm">
                <span :class="['text-pink-500', 'mb-1', 'mr-2', 'flex-1', 'min-w-0', 'truncate']">
                  {{ vision.file?.name }}
                </span>
                <span :class="['text-sm', 'mb-1', 'ml-[50%] text-orange-600']">
                  {{ formatDistanceToNow(vision.chunk!.created_at, { addSuffix: true }) }}
                </span>
              </div>

              <div
                :class="[
                  'w-full',
                  'p-5 wrap-break-word',
                  'text-justify bg-black/80 text-white rounded-b-sm',
                ]"
                v-html="md.render(vision.text)"
              />
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <ChatTextWidget :class="['bg-white/30', 'rounded-sm', 'select-none']" />
    </template>
  </ChatLayout>
</template>
