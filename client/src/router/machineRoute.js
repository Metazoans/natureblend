/*
  파일명 : machineRoute.js
  작성자 : 김선용
  개요   : 설비 라우터
  작성일 : 2024-12-12
*/

import MachineList from '@/views/machine/MachineList.vue';

//임시페이지
import MachineManage from '@/views/machine/MachineManage.vue';
import ModalView from '@/views/machine/ModalView.vue';

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
  {
    path: 'manage',
    name: 'machineManage',
    component: MachineManage
  },

  // 테스트용
  {
    path: 'test',
    name: 'modalView',
    component: ModalView
  }


];

export default machineRoute;



