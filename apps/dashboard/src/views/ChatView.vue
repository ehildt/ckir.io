<script setup lang="ts">
import { formatDistanceToNow } from "date-fns";
import DOMPurify from "isomorphic-dompurify";
import { Marked } from "marked";

import ImageBase64 from "../elements/images/ImageBase64.vue";
import ChatLayout from "../layouts/ChatLayout.vue";
import { useVisionStore } from "../store/use-vision/use-vision.store";
import AttachmentList from "../widgets/attachment-list/AttachmentList.vue";
import ChatTextWidget from "../widgets/chatbox/ChatBox.vue";

const vStore = useVisionStore();

const marked = new Marked();
const safeHtml = (text: string) => DOMPurify.sanitize(marked.parse(text) as string);
</script>

<template>
  <ChatLayout>
    <template #sidebar-left>
      <div :class="['h-full', 'rounded-sm', 'select-none']">Sidebar</div>
    </template>

    <template #sidebar-right>
      <div class="flex gap-1 flex-col h-full">
        <AttachmentList v-show="vStore.atts?.length" :class="['rounded-sm', 'select-none']" />
      </div>
    </template>

    <template #main>
      <div :class="['h-full', 'rounded-sm', 'select-text', 'flex', 'flex-col', 'gap-1']">
        <nav :class="['bg-white/50', 'rounded-sm', 'p-1.5']">some nav header menu here</nav>
        <div class="overflow-y-scroll scrollbar-hide flex gap-1 flex-col-reverse">
          <div v-for="vision in vStore.ocrs" :key="(vision.file as File)?.name">
            <div v-if="vision.text" :class="['rounded-sm', 'p-1 flex gap-0.5 flex-col']">
              <div class="flex items-center p-2 pl-5 pr-5 bg-black rounded-t-sm">
                <span :class="['text-pink-500', 'mb-1', 'mr-2', 'flex-1', 'min-w-0', 'truncate']">
                  {{ (vision.file as File)?.name }}
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
                v-html="safeHtml(vision.text)"
              />
            </div>
          </div>
        </div>

        <div class="overflow-y-scroll scrollbar-hide flex gap-1 flex-col">
          <div v-for="vision in vStore.dscs" :key="(vision.file as File)?.name">
            <div v-if="vision.text" :class="['rounded-sm', 'p-0.5 flex gap-0.5 flex-col bg-white']">
              <div class="flex items-center p-2 pl-5 pr-5 bg-black rounded-t-sm">
                <span :class="['text-pink-500', 'mb-1', 'mr-2', 'flex-1', 'min-w-0', 'truncate']">
                  {{ (vision.file as File)?.name }}
                </span>
                <span :class="['text-sm', 'mb-1', 'ml-[20%] text-orange-600']">
                  {{ formatDistanceToNow(vision.chunk!.created_at, { addSuffix: true }) }}
                </span>
              </div>

              <div
                :class="[
                  'w-full',
                  'h-full',
                  'text-justify bg-black/80 text-white rounded-b-sm p-2',
                ]"
              >
                <ImageBase64
                  :file="vision.file as File"
                  class="object-cover float-right lg:max-h-80 lg:max-w-80 pl-4 pt-4 pb-2 pr-2"
                />
                <p class="p-2 wrap-break-word" v-html="safeHtml(vision.text)" />
              </div>
            </div>
          </div>
        </div>

        <div class="overflow-y-scroll scrollbar-hide flex gap-1 flex-col-reverse">
          <div v-for="vision in vStore.cmps" :key="vision.hash">
            <div v-if="vision.text" :class="['rounded-sm', 'p-1 flex gap-0.5 flex-col bg-white']">
              <div class="flex items-center p-2 pl-5 pr-5 bg-black rounded-t-sm">
                <span :class="['text-pink-500', 'mb-1', 'mr-2', 'flex-1', 'min-w-0', 'truncate']">
                  {{ (vision.file as File[]).map((f) => f.name).join(",") }}
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
                v-html="safeHtml(vision.text)"
              />
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <ChatTextWidget :class="['rounded-sm', 'select-none']" />
    </template>
  </ChatLayout>
</template>
