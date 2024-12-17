// 품질 라우터

/*
  파일명 : QualityRoute.js
  작성자 : 이신화
  개요   : 품질 라우터
  작성일 : 2024-12-12
*/

import QualityList from '../views/quality/QualityList.vue';
import QualityList2 from '@/views/quality/QualityList2.vue';
import QualityList3 from '@/views/quality/QualityList3.vue';
import QualityList4 from '@/views/quality/QualityList4.vue';

const qualityRoute = [
  {
    path: '',
    redirect : { name : 'qualityList'}
  },
  {
    path: 'list',
    name: 'qualityList',
    component: QualityList
  },
  {
    path: 'list2',
    name: 'qualityList2',
    component: QualityList2
  },
  {
    path: 'list3',
    name: 'qualityList3',
    component: QualityList3
  },
  {
    path: 'list4',
    name: 'qualityList4',
    component: QualityList4
  },
];

export default qualityRoute;
