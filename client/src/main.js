import { createApp } from "vue";
import App from "./App.vue";
import store from "./store";
import router from "./router";
import "./assets/css/nucleo-icons.css";
import "./assets/css/nucleo-svg.css";
import MaterialDashboard from "./material-dashboard";
import '@grapecity/wijmo.styles/wijmo.css'; // 하연추가

const appInstance = createApp(App);


appInstance.config.compilerOptions.isCustomElement = (tag) => tag.startsWith("wj-"); // 하연추가

appInstance.use(store);
appInstance.use(router);
appInstance.use(MaterialDashboard);
appInstance.mount("#app");