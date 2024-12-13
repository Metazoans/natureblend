// 생산 라우터

import ProductionList from '@/views/production/ProductionList.vue';
import ProductionAdd from "@/views/production/ProductionAdd.vue";

const productionRoute = [
  {
    path: '',
    redirect : { name : 'productionList'}
  },
  {
    path: 'list',
    name: 'productionList',
    component: ProductionList
  },
  {
    path: 'add',
    name: 'productionAdd',
    component: ProductionAdd
  },
];

export default productionRoute;