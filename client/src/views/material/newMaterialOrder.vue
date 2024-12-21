<template>
    <div>
        <h3>&nbsp;&nbsp;자재 주문 관리 (리뉴얼)</h3>
    </div>
    <div class="d-flex">
        <div class="p-2 flex-fill">
            <!-- productorderlist자식에게 needMaterialList 자식꺼 에밋으로 받아올때 발동하는 메소드 -->
            <newMaterialOrderPlan :productorderlist="productorderlist" @planAndBomList="needMaterialList"/>
        </div>
        <div class="p-2 flex-fill">
            <newMaterialOrderList @planAndClientList="needClientList" :material_code="material_code" :material_name="material_name"/>
        </div>
    </div>
   <!-- 위에서 만들어진거 요기에 보냄-->
   <newMaterialOrderOffer :planMaterialList="planMaterialList" :clientList="clientList" @seachClient="seachClienting"/>
</template>
<script>
import axios from 'axios';
import { ajaxUrl } from '@/utils/commons.js';

import newMaterialOrderPlan from '@/views/material/newMaterialOrderPlan.vue';
import newMaterialOrderList from '@/views/material/newMaterialOrderList.vue';
import newMaterialOrderOffer from '@/views/material/newMaterialOrderOffer.vue';
export default {
    name: "myBestPage",
    components: {
        newMaterialOrderPlan,
        newMaterialOrderList,
        newMaterialOrderOffer,
    },
    // 변수 선언
    data() {
        return {
            productorderlist: [],
            planMaterialList: [],
            material_code: '',
            material_name: '',
            clientList: [],
        };
    },
    computed: {
    },
    //각종 메소드들
    methods: {
        //계획 리스트 불러옴
        async productorder(){
            let result = await axios.get(`${ajaxUrl}/material/orderplan`)
                            .catch(err => console.log(err));
            this.productorderlist = result.data;
            //console.log(result.data);
        },
        needMaterialList(data) {
            this.planMaterialList = [];
            this.planMaterialList = data;
            console.log('부모에서 받은 자재 리스트:', this.planMaterialList);
        },
        seachClienting(data, data2) {
            this.material_code = data;
            this.material_name = data2;
            console.log('부모에서 받은 자재 코드:', this.material_code, this.material_name);
        },
        needClientList(data) {
            this.clientList = data;
            console.log('부모한테 받은 회사코드', this.clientList);
            this.material_code = '';
            this.material_name = '';
        },
    },

    //생성될떄 작업하는거
    created(){
        this.productorder();
    },
};  
</script>