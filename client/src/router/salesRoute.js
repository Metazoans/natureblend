// 영업 라우터
import orderForm from '@/views/sales/Order/orderForm.vue';
import orderlistSearch from '@/views/sales/Order/orderlistSearch.vue';
import orderInfo from '@/views/sales/Order/orderInfo.vue';
import outputManage from '@/views/sales/ProductOutput/outputManage.vue';
import inputManage from '@/views/sales/ProductInput/inputManage.vue';
import inputList from '@/views/sales/ProductInput/inputList.vue';
import productInventory from '@/views/sales/productInventory.vue'


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
    },

    {
        path:'/input/management',
        name: 'inputManage',
        component:inputManage
    },
    {
        path : '/input/inputlist',
        name : 'inputList',
        component:inputList
    },
    {
        path : '/inventory/product',
        name : 'productInventory',
        component:productInventory
    }




];

export default salesRoute;