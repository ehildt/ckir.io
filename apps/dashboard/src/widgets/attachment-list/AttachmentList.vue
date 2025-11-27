<script setup lang="ts">
import AttachmentCard from "../../elements/cards/AttachmentCard.vue";
import OverlayContainer from "../../elements/containers/OverlayContainer.vue";
import AttachmentHeader from "../../elements/headers/AttachmentHeader.vue";
import IconifyCancel from "../../elements/icons/IconifyCancel.vue";
import IconifyFetching from "../../elements/icons/IconifyFetching.vue";
import IconifyJpeg from "../../elements/icons/IconifyJpeg.vue";
import IconifyLoading from "../../elements/icons/IconifyLoading.vue";
import IconifyPng from "../../elements/icons/IconifyPng.vue";
import IconifyWebp from "../../elements/icons/IconifyWebp.vue";
import ImageBase64 from "../../elements/images/ImageBase64.vue";
import { useVisionStore } from "../../store/use-vision/use-vision.store";

const vStore = useVisionStore();

const getExtension = (file: File) => file.name.split(".").pop()?.toLowerCase() ?? "";
const isJpeg = (file: File) => ["jpg", "jpeg"].includes(getExtension(file));
const isPng = (file: File) => getExtension(file) === "png";
const isWebp = (file: File) => getExtension(file) === "webp";
</script>

<template>
  <div v-if="vStore.atts.length" class="p-5 h-full">
    <div class="bg-white/50 p-1.5 rounded-sm">
      <AttachmentHeader label="ATTACHMENTS" :attachment-size="vStore.atts.length" />
    </div>
    <div class="scrollbar-hide overflow-y-scroll h-[95%] mt-1">
      <div class="flex gap-1 flex-col-reverse">
        <div v-for="vision in vStore.atts" :key="vision.file.name">
          <AttachmentCard
            v-if="vision.file.type !== 'mock'"
            :file="vision.file"
            class="bg-black/70 text-white"
          >
            <template #icon-left>
              <IconifyJpeg v-if="isJpeg(vision.file)" class="size-8 m-0.5" />
              <IconifyWebp v-else-if="isWebp(vision.file)" class="size-8 m-0.5" />
              <IconifyPng v-else-if="isPng(vision.file)" class="size-8 m-0.5" />
            </template>

            <template #icon-right>
              <IconifyLoading
                v-if="vision?.status === 'pending'"
                class="text-blue-600 size-8 m-0.5"
              />
              <IconifyFetching
                v-if="vision?.status === 'fetching'"
                class="text-green-600 size-8 m-0.5"
              />
              <IconifyCancel
                class="text-gray-100/40 size-8 m-0.5 hover:text-pink-700 cursor-pointer"
                @click="vStore.remove(vision)"
              />
            </template>

            <template #card>
              <OverlayContainer
                :active="vision?.status === 'fetching'"
                :pulse="!vision.chunk?.done && vision?.status !== 'fetching'"
              >
                <ImageBase64
                  :file="vision.file"
                  :class="[
                    'transition duration-300',
                    vision?.status === 'done' ? 'grayscale hover:grayscale-0' : 'grayscale-0',
                  ]"
                />
                <template #overlay>
                  <span class="p-2 pl-5 pr-5 block animate-ping">
                    {{ vision.chunk?.message.content }}
                  </span>
                </template>
              </OverlayContainer>
            </template>
          </AttachmentCard>
        </div>
      </div>
    </div>
  </div>
</template>
