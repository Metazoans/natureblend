/*
  파일명 : machineRoute.js
  작성자 : 김선용
  개요   : 설비 라우터
  작성일 : 2024-12-12
*/

import MachineList from '@/views/machine/MachineList.vue';
import MachineInfo from '@/views/machine/MachineInfo.vue';
import PartsList from '@/views/machine/PartsList';
import InActList from '@/views/machine/InActList';
import RequestList from '@/views/machine/RequestList';
import RequestEnd from '@/views/machine/RequestEnd';

const machineRoute = [
  {
    path: '',
    redirect : { name : 'machineList'}
  },
  
  // 설비 페이지
  {
    path: 'list',
    name: 'machineList',
    component: MachineList
  },
  {
    path: 'machineInfo',
    name: 'machineInfo',
    component: MachineInfo
  },

  // 부품 페이지
  {
    path: 'partsList',
    name: 'partsList',
    component: PartsList
  },

  // 비가동 페이지
  {
    path: 'inActList',
    name: 'inActList',
    component: InActList
  },

  // 정비 페이지
  {
    path: 'requestList',
    name: 'requestList',
    component: RequestList
  },
  {
    path: 'requestEnd',
    name: 'requestEnd',
    component: RequestEnd
  },

  // 테스트용


];

export default machineRoute;



