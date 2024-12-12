// 생산 라우터

import ProductionList from '@/views/production/ProductionList.vue';

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
];

export default productionRoute;