// 생산 라우터

import ProductList from '@/views/product/ProductList.vue';

const productRoute = [
  {
    path: '',
    redirect : { name : 'productList'}
  },
  {
    path: 'list',
    name: 'productList',
    component: ProductList
  },
];

export default productRoute;