import { createRouter, createWebHistory } from "vue-router";

import MainPage from "../views/MainPage.vue";


import MachineApp from '@/views/machine/MachineApp.vue';
import machineRoutes from "./machineRoute";

import MaterialRoute from "./materialRoute";

import ProductApp from '@/views/product/ProductApp.vue';
import productRoutes from "./productRoute";

import StandardApp from '@/views/standard/StandardApp.vue';
import standardRoutes from "./standardRoute";

import SalesApp from '@/views/sales/SalesApp.vue';
import salesRoute from "./salesRoute";

import QualityApp from '@/views/machine/QualityApp.vue';
import qualityRoute from "./qualityRoute";

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
    children : MaterialRoute
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
