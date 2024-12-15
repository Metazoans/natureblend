// 영업 라우터
import SalesList from '@/views/sales/SalesList.vue';
import orderlistSearch from '@/views/sales/orderlistSearch.vue';

const salesRoute = [
    {
        path:'',
        redirect :{ name : 'salesList'}
    },
    {
        path:'list',
        name :'salesList',
        component: SalesList
    },
    {
        path:'orderlist/search',
        name :'orderlistSearch',
        component: orderlistSearch
    },
];

export default salesRoute;