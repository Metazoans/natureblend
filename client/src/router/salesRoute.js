// 영업 라우터
import SalesList from '@/views/sales/SalesList.vue';

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
];

export default salesRoute;