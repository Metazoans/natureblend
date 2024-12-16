import { createApp } from "vue";
import App from "./App.vue";
import store from "./store";
import router from "./router";
import "./assets/css/nucleo-icons.css";
import "./assets/css/nucleo-svg.css";
import MaterialDashboard from "./material-dashboard";
import Notifications from '@kyvg/vue3-notification'
import { departments } from './utils/dataCode.js';


const app = createApp(App);

app.config.globalProperties.$departments = departments;

app.use(store);
app.use(router);
app.use(MaterialDashboard);
app.use(Notifications)
app.mount("#app");
