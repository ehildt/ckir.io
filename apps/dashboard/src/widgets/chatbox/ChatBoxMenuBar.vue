<script setup lang="ts">
import { ref } from "vue";

import type { VisionList } from "../../store/use-vision/use-vision.model";
import { useVisionStore } from "../../store/use-vision/use-vision.store";

const vStore = useVisionStore();

const asVList = (v: string) => v as VisionList;

withDefaults(
  defineProps<{
    hoverColor?: string;
    activeColor?: string;
    passiveColor?: string;
    keyValuePairs: Array<{ icon: string; value: string; hide?: boolean }>;
  }>(),
  {
    activeColor: "text-indigo-400",
    passiveColor: "text-zinc-500",
    hoverColor: "hover:text-violet-400",
  },
);
const activeIndex = ref(0);
const setActive = (index: number) => (activeIndex.value = index);
const emit = defineEmits<{
  (e: "onValueUpdate", value: string): void;
}>();
</script>

<template>
  <div class="flex gap-1 relative">
    <Transition
      v-for="(item, index) in keyValuePairs"
      :key="item.icon"
      mode="out-in"
      enter-active-class="transition-opacity duration-500 ease-out"
      leave-active-class="transition-opacity duration-300 ease-in"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="!item.hide">
        <span
          v-if="vStore[asVList(item.value)]?.length"
          :class="[{ 'animate-pulse': vStore[asVList(item.value)].length }]"
          class="absolute -top-1 px-1 text-xs text-indigo-400 select-none bg-transparent font-bold z-10"
        >
          {{ vStore[asVList(item.value)].length }}
        </span>

        <span
          tabindex="0"
          :class="[
            item.icon,
            'size-8 cursor-pointer',
            { 'animate-pulse': index === activeIndex },
            { 'hover:animate-pulse': index !== activeIndex },
            { [hoverColor]: index !== activeIndex },
            { [activeColor]: index === activeIndex },
            { [passiveColor]: index !== activeIndex },
          ]"
          @click="
            () => {
              setActive(index);
              emit('onValueUpdate', item.value);
            }
          "
        />
      </div>
    </Transition>
  </div>
</template>
