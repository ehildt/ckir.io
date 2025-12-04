<script setup lang="ts">
import { formatDistanceToNow } from "date-fns";
import { Carousel, Navigation, Pagination, Slide } from "vue3-carousel";

import ImageBase64 from "../../elements/images/ImageBase64.vue";
import type { Vision } from "../../store/use-vision/use-vision.model";
import { safeHtml } from "./chat-view.helper";

defineProps<{ vision: Vision }>();
</script>

<template>
  <div v-if="vision.message?.content" class="rounded-sm flex gap-px flex-col bg-white/20">
    <div class="rounded-t-sm select-none flex items-center p-2 pl-5 pr-5 bg-black/60">
      <span :class="['text-pink-500 ', 'mr-2', 'flex-1', 'min-w-0', 'truncate']">
        {{ vision.file?.name ?? vision.message.role.toUpperCase() }}
      </span>
      <span :class="[' text-sm', 'ml-[20%] text-zinc-400']">
        {{ formatDistanceToNow(vision.chunk!.created_at, { addSuffix: true }) }}
      </span>
    </div>

    <div
      v-if="vision.message.role === 'user'"
      :class="['rounded-b-sm  w-full', 'h-fit', 'text-justify bg-black/60 text-zinc-300']"
    >
      <div
        class="safe-html overflow-y-auto scrollbar-hide p-3 wrap-break-word max-h-80 flex flex-col gap-1"
        v-html="safeHtml(vision.message.content)"
      />
    </div>

    <template v-if="vision.file && !vision.vRefs">
      <div :class="['w-full', 'h-full', 'text-justify bg-black/60 text-zinc-300  p-2']">
        <ImageBase64
          :file="vision.file"
          class="object-cover float-right lg:max-h-80 lg:max-w-80 pl-4 pt-4 pb-2 pr-2"
        />
        <div class="p-2 wrap-break-word" v-html="safeHtml(vision.message?.content)" />
      </div>
    </template>

    <div
      v-if="vision.message.role === 'assistant'"
      :class="['rounded-b-sm w-full', 'h-fit', 'text-justify bg-black/60 text-zinc-300']"
    >
      <Carousel
        v-if="vision.vRefs?.length"
        :items-to-show="2"
        :wrap-around="true"
        :autoplay="4000"
        :pause-autoplay-on-hover="true"
        :transition="2000"
        :mouse-drag="false"
      >
        <Slide v-for="v in vision.vRefs" :key="v.hash">
          <div class="relative border-b bg-neutral-800 w-full h-full border-white/20">
            <span
              class="bg-black/30 absolute top-0 right-0 py-1 px-2 text-xs text-zinc-200 select-none"
            >
              {{ v.file?.name }}
            </span>

            <ImageBase64 :file="v.file!" class="object-cover w-full h-full" />
          </div>
        </Slide>
        <template #addons>
          <Pagination v-if="vision.vRefs?.length > 1" />
          <Navigation v-if="vision.vRefs?.length > 1" />
        </template>
      </Carousel>

      <div
        class="safe-html overflow-y-auto scrollbar-hide p-3 wrap-break-word max-h-80 flex flex-col gap-1"
        v-html="safeHtml(vision.message?.content)"
      />
    </div>
  </div>
</template>

<style>
.safe-html > p {
  padding-inline: 0.5rem;
}

.safe-html > p strong {
  color: rgba(232, 241, 75, 0.858);
}

.safe-html > p em {
  color: gray;
  font-size: small;
  padding: 0.5rem;
}
</style>
