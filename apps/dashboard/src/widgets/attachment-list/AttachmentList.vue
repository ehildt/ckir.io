<script setup lang="ts">
import AttachmentCard from "../../elements/cards/AttachmentCard.vue";
import OverlayContainer from "../../elements/containers/OverlayContainer.vue";
import ImageBase64 from "../../elements/images/ImageBase64.vue";
import type { Vision } from "../../store/use-vision/use-vision.model";
import { useVisionStore } from "../../store/use-vision/use-vision.store";
import AttachmentIcon from "./AttachmentIcon.vue";
import AttachmentListHeader from "./AttachmentListHeader.vue";
import ScrollBar from "./ScrollBar.vue";

const vStore = useVisionStore();

const handleCancel = (vision: Vision) => {
  if (!vision.chunk?.done) {
    vStore.remove("atts", vision);
    vStore.remove("conv", vision);
    vStore.remove("cmps", vision);
    vStore.remove("ocrs", vision);
    vStore.remove("dscs", vision);
    // ! TODO send cancel request to model
  }
};
</script>

<template>
  <div class="h-full mx-10 flex gap-1 flex-col select-none mt-2">
    <AttachmentListHeader label="ATTACHMENTS" :size="vStore.atts.length" />

    <ScrollBar>
      <div class="grid gap-1 grid-cols-1">
        <TransitionGroup
          tag="div"
          class="overflow-y-scroll scrollbar-hide flex gap-3 flex-col h-full"
          enter-active-class="transition-all duration-200 ease-out"
          leave-active-class="transition-all duration-150 ease-in"
          enter-from-class="opacity-0 translate-y-1"
          enter-to-class="opacity-100 translate-y-0"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 translate-y-1"
          move-class="transition-transform duration-150 ease-out"
        >
          <AttachmentCard
            v-for="vision in vStore.atts"
            :key="vision.file?.name"
            :file="vision.file!"
          >
            <template #icon-left>
              <AttachmentIcon :type="vision.file?.type!" class="size-7 text-white" />
            </template>

            <template #icon-right>
              <AttachmentIcon
                v-if="vision?.status === 'pending'"
                type="pending"
                class="text-blue-600 size-7 mr-1"
              />
              <AttachmentIcon
                v-if="vision?.status === 'fetching'"
                type="fetching"
                class="text-green-600 size-7 mr-1"
              />
              <AttachmentIcon
                type="cancel"
                class="text-gray-100/40 size-7 hover:text-pink-700 cursor-pointer"
                @click="handleCancel(vision)"
              />
            </template>

            <template #card>
              <OverlayContainer
                class="rounded-b-sm"
                :active="vision?.status === 'pending'"
                :pulse="vision?.status === 'fetching'"
              >
                <ImageBase64
                  :file="vision.file!"
                  :class="[
                    'rounded-b-sm h-full w-full object-cover transition duration-300 ',
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
        </TransitionGroup>
      </div>
    </ScrollBar>
  </div>
</template>
