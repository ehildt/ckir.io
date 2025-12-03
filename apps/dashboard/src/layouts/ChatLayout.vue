<template>
  <div class="h-dvh grid grid-cols-8 grid-rows-8 gap-2 bg-black/80 p-5">
    <nav class="col-start-1 col-span-2 row-span-full overflow-y-scroll scrollbar-hide">
      <slot name="sidebar-left" />
    </nav>

    <nav class="col-start-7 col-span-2 row-span-full overflow-y-hidden scrollbar-hide">
      <slot name="sidebar-right" />
    </nav>

    <main class="col-start-3 col-span-4 row-start-1 row-span-6 overflow-y-hidden scrollbar-hide">
      <slot name="main" />
    </main>

    <footer class="col-start-3 col-span-4 row-start-7 row-span-2">
      <slot name="footer" />
    </footer>
  </div>
</template>

<style>
.warning-bar {
  position: relative;
  background: repeating-linear-gradient(
    135deg,
    /* diagonal */ rgb(255, 128, 70) 0,
    rgb(255, 106, 70) 10px,
    transparent 10px,
    transparent 20px
  );
  background-position: center; /* keep center aligned */
}
</style>
