// 기준정보 라우터

import StandardTest from '@/views/standard/StandardTest.vue';

const standardRoute = [
  {
    path: '',
    redirect : { name : 'StandardTest'}
  },
  {
    path: 'list',
    name: 'standardTest',
    component: StandardTest
  },
];

export default standardRoute;