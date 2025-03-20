import { VueQueryPlugin } from "@tanstack/vue-query";
import { createApp } from "vue";
import App from "./App.vue";
import AppLayout from "./layouts/AppLayout.vue";
import AuthLayout from "./layouts/AuthLayout.vue";
import router from "./router";
import "./style.css";

const app = createApp(App);
app.use(router).use(VueQueryPlugin);
app.component("AppLayout", AppLayout);
app.component("AuthLayout", AuthLayout);
app.mount("#app");
