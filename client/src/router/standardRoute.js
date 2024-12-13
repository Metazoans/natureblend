// 기준정보 라우터

import StandardTest from '@/views/standard/StandardTest.vue';
import StandardTest2 from '@/views/standard/StandardTest2.vue';

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
  {
    path: '',
    redirect : { name : 'StandardTest2'}
  },
  {
    path: 'list2',
    name: 'standardTest2',
    component: StandardTest2
  },
];

export default standardRoute;