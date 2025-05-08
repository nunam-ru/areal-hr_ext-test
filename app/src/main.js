import { createApp } from "vue";
import { createVuetify } from "vuetify";
import { createPinia } from "pinia";
import piniaPersist from "pinia-plugin-persistedstate";
import { ru } from "vuetify/locale";
import "vuetify/styles";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import "@mdi/font/css/materialdesignicons.css";

import App from "./App.vue";
import router from "./router/index";
import VueTheMask from 'vue-the-mask';

const vuetify = createVuetify({
  components,
  directives,
  locale: {
    locale: "ru",
    messages: { ru },
  },
});

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPersist);

app.use(pinia);
app.use(vuetify);
app.use(router);
app.use(VueTheMask)

app.mount("#app");
