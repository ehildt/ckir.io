import { VueQueryPlugin } from "@tanstack/vue-query";
import FloatingVue from "floating-vue";
import { createPinia } from "pinia";
import { createApp } from "vue";

import App from "./App.vue";

const app = createApp(App);
app.use(VueQueryPlugin);
app.use(FloatingVue);
app.use(createPinia());
app.mount("#app");
