<script setup lang="ts">
import { computed } from "vue";

import ChatLayout from "../../layouts/ChatLayout.vue";
import { useVisionStore } from "../../store/use-vision/use-vision.store";
import AttachmentList from "../../widgets/attachment-list/AttachmentList.vue";
import ChatTextWidget from "../../widgets/chatbox/ChatBox.vue";
import ChatViewCard from "./ChatViewCard.vue";
import ChatViewPrompt from "./ChatViewPrompt.vue";

const vStore = useVisionStore();
type Tab = "conv" | "dscs" | "cmps" | "ocrs";
const activeTab = computed(() => vStore.ctx.view.tab as Tab);

const visionsByTab = computed(
  () =>
    ({
      conv: vStore.conv,
      dscs: vStore.dscs,
      cmps: vStore.cmps,
      ocrs: vStore.ocrs,
    }) as const,
);

const activeVisions = computed(() => {
  const tab = activeTab.value;
  return visionsByTab.value[tab] ?? [];
});
</script>

<template>
  <ChatLayout>
    <template #sidebar-left></template>

    <template #sidebar-right>
      <Transition
        enter-active-class="transition-opacity duration-200 ease-out"
        leave-active-class="transition-opacity duration-150 ease-in"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <AttachmentList v-if="vStore.atts?.length" />
      </Transition>
    </template>

    <template #main>
      <div class="h-full rounded-sm select-text flex flex-col gap-3">
        <Transition
          mode="out-in"
          enter-active-class="transition-opacity duration-500 ease-out"
          leave-active-class="transition-opacity duration-300 ease-in"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <ChatViewCard v-if="activeVisions.length" :key="activeTab" :visions="activeVisions" />
        </Transition>

        <div class="mt-auto">
          <Transition
            enter-active-class="transition-opacity duration-200 ease-out"
            leave-active-class="transition-opacity duration-150 ease-in"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
          >
            <ChatViewPrompt
              v-if="vStore.ctx.vropts.prompt"
              :prompt="vStore.ctx.vropts.prompt ?? ''"
              :pulse="true"
              label="COMPOSE"
            />
          </Transition>

          <ChatTextWidget class="rounded-sm select-none" />
        </div>
      </div>
    </template>
  </ChatLayout>
</template>
