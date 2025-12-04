<template>
  <div class="h-dvh grid grid-cols-8 grid-rows-8 gap-3 bg-black/80 p-5">
    <nav class="col-start-1 col-span-2 row-span-full overflow-y-scroll scrollbar-hide">
      <slot name="sidebar-left" />
    </nav>

    <nav class="col-start-7 col-span-2 row-span-full overflow-y-hidden scrollbar-hide">
      <slot name="sidebar-right" />
    </nav>

    <main class="col-start-3 col-span-4 row-start-1 row-span-8 overflow-y-hidden scrollbar-hide">
      <slot name="main" />
    </main>
  </div>
</template>
