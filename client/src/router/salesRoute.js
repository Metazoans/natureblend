// 영업 라우터
import orderForm from '@/views/sales/Order/orderForm.vue';
import orderlistSearch from '@/views/sales/Order/orderlistSearch.vue';
import orderInfo from '@/views/sales/Order/orderInfo.vue';
import outputManage from '@/views/sales/ProductOutput/outputManage.vue';


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

    {
        path:'/orderlist/orderinfo/:no',
        name : 'orderInfo',
        component: orderInfo
    },

    {
        path:'/output/management',
        name:'outputManage',
        component:outputManage
    }
];

export default salesRoute;