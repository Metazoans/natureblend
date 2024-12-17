<template>
    <h1>clientlist</h1>
    <!--모달 안에 거래처 목록 출력-->
    <div>
        <ul>
            <li v-for="client in clientList" 
            :key="client.com_name"
            class="client"
            :class="{selected : clientName === client.com_name}"
            @click = "selectclient(client)"
            >
            </li>
        </ul>
    </div>
</template>
<script>
import axios from "axios";
import {ajaxUrl} from "@/utils/commons";

export default{
    name : "clientList",

    data(){
        return{
            clientList:[], //거래처명 목록 저장
            clientName : "", // 거래처명 선택한것 
        }
    },
    created(){
        this.getClientList()
    },
    methods: {
        async getClientList(){
            let result = await axios.get(`${ajaxUrl}/api/clients`) //서버호출
                                        .catch(err=> console.log(err));
            this.clientList = result.data; //거래처목록 저장
        },

        selectclient(client){
            this.selectClient = client
            this.$emit('selectclient',client);
        },
        
    }
}
    
    
</script>