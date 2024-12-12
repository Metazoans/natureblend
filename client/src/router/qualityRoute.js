// 품질 라우터

/*
  파일명 : QualityRoute.js
  작성자 : 이신화
  개요   : 품질 라우터
  작성일 : 2024-12-12
*/

import QualityList from '../views/quality/QualityList.vue';

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
];

export default qualityRoute;
