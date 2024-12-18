// 생산 라우터

import ProductionPlanList from '@/views/production/ProductionPlanList.vue';
import productionPlanAdd from "@/views/production/productionPlanAdd/PlanAdd.vue";
import productionOrderList from "@/views/production/ProductionOrderList.vue";
import productionOrderAdd from "@/views/production/ProductionOrderAdd/OrderAdd.vue";

const productionRoute = [
  {
    path: '',
    redirect : { name : 'productionPlanList'}
  },
  {
    path: 'plan/list',
    name: 'productionPlanList',
    component: ProductionPlanList
  },
  {
    path: 'plan/add',
    name: 'productionPlanAdd',
    component: productionPlanAdd
  },
  {
    path: 'order/list',
    name: 'productionOrderList',
    component: productionOrderList
  },
  {
    path: 'order/add',
    name: 'productionOrderAdd',
    component: productionOrderAdd
  },
];

export default productionRoute;