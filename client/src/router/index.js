import { createRouter, createWebHistory } from "vue-router";

import MainPage from "../views/MainPage.vue";


import MachineApp from '@/views/machine/MachineApp.vue';
import machineRoutes from "./machineRoute";

const routes = [
  // 공용 페이지
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

  // 영업

  // 자재

  // 생산

  // 품질

  // 설비
  {
    path: '/machine',
    name: 'machineApp',
    component: MachineApp,
    children : machineRoutes
  },
  // 기준정보



];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkActiveClass: "active",
});

export default router;
