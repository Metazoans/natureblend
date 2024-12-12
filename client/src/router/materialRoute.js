// 자재 라우터
import MaterialList from '@/views/material/materialOrder.vue';

const materialRoute = [
  {
    path: '',
    redirect : { name : 'materialList'}
  },
  {
    path: 'list',
    name: 'materialList',
    component: MaterialList
  },
];

export default materialRoute;