// 영업 라우터
import orderForm from '@/views/sales/Order/orderForm.vue';
import orderlistSearch from '@/views/sales/Order/orderlistSearch.vue';

const salesRoute = [
    {
        path:'',
        redirect :{ name : 'salesList'}
    },
    {
        path:'/orderForm/insert',
        name :'orderForm',
        component: orderForm
    },
    {
        path:'/orderlist/search',
        name :'orderlistSearch',
        component: orderlistSearch
    },
];

export default salesRoute;