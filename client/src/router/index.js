import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'


import MachineApp from '@/views/machine/MachineApp.vue';
import machineRoute from "./machineRoute";

import MaterialApp from '@/views/material/MaterialApp.vue';
import materialRoute from "./materialRoute";

import ProductionApp from '@/views/production/ProductionApp.vue';
import productionRoute from "./productionRoute";

import StandardApp from '@/views/standard/StandardApp.vue';
import standardRoute from "./standardRoute";

import SalesApp from '@/views/sales/SalesApp.vue';
import salesRoute from "./salesRoute";

import QualityApp from '@/views/quality/QualityApp.vue';
import qualityRoute from "./qualityRoute";

const routes = [
  // 공용 페이지
  {
    path: '/',
    name: 'home',
    component: HomeView
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
    children : materialRoute
  },

  // 생산
  {
    path: "/production",
    name: "productionApp",
    component: ProductionApp,
    children : productionRoute
  },

  // 품질
  {
    path: "/quality",
    name: "qualityApp",
    component: QualityApp,
    children : qualityRoute
  },

  // 설비
  {
    path: '/machine',
    name: 'machineApp',
    component: MachineApp,
    children : machineRoute
  },

  // 기준정보
  {
    path: "/standard",
    name: "standardApp",
    component: StandardApp,
    children : standardRoute
  },

];
>>>>>>> 5fcc082b0ca74b5b152e020b4a4703fde09f68b5

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
