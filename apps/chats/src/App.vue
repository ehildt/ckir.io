<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue';
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600 text-white flex items-center justify-center p-8">
    <div class="text-center space-y-6">
      <div class="flex items-center justify-center gap-6">
        <img src="/chats.svg" class="logo" alt="Vite logo" />
        <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
      </div>

      <h1 class="text-4xl font-extrabold tracking-tight drop-shadow">Vite + Vue + Tailwind</h1>

      <span class="inline-block rounded-full bg-white/20 px-3 py-1 text-sm font-semibold">
        ✅ Tailwind is working
      </span>

      <button class="rounded-xl bg-white text-purple-700 px-5 py-2 font-semibold shadow hover:shadow-lg transition
               hover:scale-[1.02] active:scale-95">
        Colorful Button
      </button>

      <HelloWorld msg="Vite + Vue" />
    </div>
  </div>
</template>

<style scoped>
.logo {
  height: 5rem;
  will-change: filter;
  transition: filter 300ms;
  filter: drop-shadow(0 0 1.2em rgba(255, 255, 255, .4));
}

.logo:hover {
  filter: drop-shadow(0 0 2em #fff);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883);
}
</style>
