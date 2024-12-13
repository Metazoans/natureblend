// 자재 라우터
import MaterialList from '@/views/material/materialOrder.vue';
import Tabletest from '@/views/material/Tables.vue';

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
    path: 'test',
    name: 'tabletest',
    component: Tabletest
  },
];

export default materialRoute;