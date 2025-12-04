<script setup lang="ts">
import type { ViewTab, VisionTask } from "../../store/use-vision/use-vision.model";
import { useVisionStore } from "../../store/use-vision/use-vision.store";
import ChatBoxMenuBar from "./ChatBoxMenuBar.vue";
import ChatBoxMenuSpacer from "./ChatBoxMenuSpacer.vue";

defineProps<{ verbose?: true }>();
const vStore = useVisionStore();
const handleTabs = (tab: string) => vStore.setTab(tab as ViewTab);
const handleTask = (task: string) => vStore.setTask(task as VisionTask);
</script>

<template>
  <nav class="mt-5 rounded-sm">
    <div class="relative">
      <div class="flex items-center justify-between">
        <div class="flex items-center relative w-full">
          <div class="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-black/30" />
          <ChatBoxMenuBar
            class="mr-auto pl-8"
            active-color="text-violet-400"
            hover-color="hover:text-indigo-400"
            :key-value-pairs="[
              { icon: 'icon-[ph--chats-fill]', value: 'conv' },
              {
                icon: 'icon-[fluent--slide-text-multiple-32-filled]',
                value: 'dscs',
                hide: !vStore.dscs?.length,
              },
              { icon: 'icon-[ic--round-compare]', value: 'cmps', hide: !vStore.cmps?.length },
              {
                icon: 'icon-[lucide-lab--text-square]',
                value: 'ocrs',
                hide: !vStore.ocrs?.length,
              },
            ]"
            @on-value-update="handleTabs"
          />
        </div>

        <ChatBoxMenuSpacer
          v-if="verbose"
          :tab="vStore.ctx.view.tab"
          :task="vStore.ctx.vropts.task"
        />

        <div class="flex items-center relative w-full">
          <div class="pointer-events-none absolute inset-x-0 h-px bg-black/30" />
          <ChatBoxMenuBar
            class="ml-auto pr-8 flex-row-reverse"
            active-color="text-violet-400"
            hover-color="hover:text-indigo-400"
            :key-value-pairs="[
              {
                icon: 'icon-[fluent--comment-multiple-link-28-filled]',
                value: 'describe',
              },
              { icon: 'icon-[mdi--select-compare]', value: 'compare' },
              { icon: 'icon-[lucide--scan-text]', value: 'ocr' },
            ]"
            @on-value-update="handleTask"
          />
        </div>
      </div>
    </div>
  </nav>
</template>
