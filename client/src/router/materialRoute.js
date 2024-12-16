// 자재 라우터

//자재 주문관리
import MaterialList from '@/views/material/materialOrder.vue';

//자재 주문조회
import MaterialOrderList from '@/views/material/materialOrderList.vue';

//자재 입고
import MaterialInput from '@/views/material/materialInput.vue';

//자재 입고 조회
import MaterialInputList from '@/views/material/materialInputList.vue';

//자재 LOT 조회
import MaterialLotqty from '@/views/material/materialLotqty.vue';

//자재 재고 조회
import Materialqty from '@/views/material/materialqty.vue';

//테스트
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
    path: 'orderlist',
    name: 'materialOrderList',
    component: MaterialOrderList
  },
  {
    path: 'input',
    name: 'materialInput',
    component: MaterialInput
  },
  {
    path: 'inputlist',
    name: 'materialInputList',
    component: MaterialInputList
  },
  {
    path: 'lotqty',
    name: 'materialLotqty',
    component: MaterialLotqty
  },
  {
    path: 'materialqty',
    name: 'materialqty',
    component: Materialqty
  },
  {
    path: 'test',
    name: 'tabletest',
    component: Tabletest
  },
];

export default materialRoute;