// 자재 라우터
import MaterialList from '@/views/material/materialOrder.vue';
import MaterialList2 from '@/views/material/materialOrder2.vue';
import MaterialList3 from '@/views/material/materialOrder3.vue';

const materialRoute = [
  {
    path: '',
    redirect : { name : 'materialList'}
  },
  {
    path: 'order',
    name: 'materialList',
    component: MaterialList
  },
  {
    path: 'order2',
    name: 'materialList2',
    component: MaterialList2
  },
  {
    path: 'order3',
    name: 'materialList3',
    component: MaterialList3
  },
];

export default materialRoute;