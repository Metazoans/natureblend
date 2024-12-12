import { createRouter, createWebHistory } from "vue-router";

import MainPage from "../views/MainPage.vue";


import MachineApp from '@/views/machine/MachineApp.vue';
import machineRoutes from "./machineRoute";
import SalesApp from '@/views/sales/SalesApp.vue';
import salesRoute from "./salesRoute";

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
  {
    path: "/sales",
    name: "salesApp",
    component: SalesApp,
    children : salesRoute
  },

  // 자재
  {
    path: "/material",
    name: "materialApp",
    component: MaterialApp,
    children : MaterialRoutes
  },

  // 생산
  {
    path: "/product",
    name: "productApp",
    component: ProductApp,
    children : ProductRoutes
  },

  // 품질
  {
    path: "/quality",
    name: "qualityApp",
    component: QualityApp,
    children : QualityRoutes
  },

  // 설비
  {
    path: '/machine',
    name: 'machineApp',
    component: MachineApp,
    children : machineRoutes
  },

  // 기준정보
  {
    path: "/standard",
    name: "standardApp",
    component: StandardApp,
    children : StandardRoutes
  },

];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkActiveClass: "active",
});

export default router;
