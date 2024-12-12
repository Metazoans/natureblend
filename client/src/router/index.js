import { createRouter, createWebHistory } from "vue-router";

import MainPage from "../views/MainPage.vue";

const routes = [
  {
    path: "/",
    name: "/",
    redirect: "/mainpage",
  },
  {
    path: "/mainpage",
    name: "MainPage",
    component: MainPage,
  },

];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkActiveClass: "active",
});

export default router;
