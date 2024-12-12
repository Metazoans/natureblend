/*
  파일명 : machineRoute.js
  작성자 : 김선용
  개요   : 설비 라우터
  작성일 : 2024-12-12
*/

import MachineList from '@/views/machine/MachineList.vue';

const machineRoute = [
  {
    path: '',
    redirect : { name : 'machineList'}
  },
  {
    path: 'list',
    name: 'machineList',
    component: MachineList
  },
];

export default machineRoute;



