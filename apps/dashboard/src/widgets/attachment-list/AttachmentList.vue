<script setup lang="ts">
import AttachmentCard from "../../elements/cards/AttachmentCard.vue";
import OverlayContainer from "../../elements/containers/OverlayContainer.vue";
import AttachmentHeader from "../../elements/headers/AttachmentHeader.vue";
import IconifyCancel from "../../elements/icons/IconifyCancel.vue";
import IconifyJpeg from "../../elements/icons/IconifyJpeg.vue";
import IconifyLoading from "../../elements/icons/IconifyLoading.vue";
import IconifyPng from "../../elements/icons/IconifyPng.vue";
import IconifyWebp from "../../elements/icons/IconifyWebp.vue";
import ImageBase64 from "../../elements/images/ImageBase64.vue";

const props = defineProps<{ attachments: Array<File>; isPending: boolean }>();

const emit = defineEmits<{
  (e: "onCancel", file: File): void;
}>();
</script>

<template>
  <div v-if="props.attachments?.length" class="p-5">
    <div class="flex gap-1 bg-white/50 items-center align-middle w-full p-1.5 rounded-sm">
      <AttachmentHeader label="ATTACHMENTS" :attachment-size="props.attachments?.length" />
    </div>
    <hr />
    <div
      class="flex gap-1 mt-1 scrollbar-hide overflow-y-scroll lg:max-h-188.5 md:max-h-100 flex-col-reverse"
    >
      <template v-for="file in props.attachments" :key="file.name">
        <AttachmentCard :file="file" class="bg-black/70 text-white">
          <template #icon-left>
            <IconifyJpeg v-if="/\.jpe?g$/i.test(file.name)" class="size-8 m-0.5" />
            <IconifyWebp v-if="/\.webp$/i.test(file.name)" class="size-8 m-0.5" />
            <IconifyPng v-if="/\.png$/i.test(file.name)" class="size-8 m-0.5" />
          </template>

          <template #icon-right>
            <IconifyCancel
              class="text-gray-100/40 size-8 m-0.5 hover:text-pink-700 cursor-pointer"
              @click="() => emit('onCancel', file)"
            />
          </template>

          <template #card>
            <OverlayContainer :active="isPending">
              <template #content>
                <ImageBase64 :file="file" />
              </template>
              <template #overlay>
                <IconifyLoading class="text-blue-600 size-14 m-0.5" />
              </template>
            </OverlayContainer>
          </template>
        </AttachmentCard>
      </template>
    </div>
  </div>
</template>
