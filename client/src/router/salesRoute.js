// 영업 라우터
import SalesList from '@/views/sales/SalesList.vue';
import SalesForm from '@/views/sales/SalesForm.vue';

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
        path:'form',
        name :'salesForm',
        component: SalesForm
    },
];

export default salesRoute;