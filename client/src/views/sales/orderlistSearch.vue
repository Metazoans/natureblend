<template>
    <div class="container-fluid py-4">
        <!--검색 폼 -->
        <h2>주문서관리</h2>

        <!--주문서 상태 체크 박스-->
            <div class="mb-3">
                <label class="form-label fw-bold">주문상태</label>
                <div>
                    <label class="me-3" v-for="status in statusList" :key="status">
                    <input 
                        type="checkbox" 
                        v-model="pickedStatus" 
                        :value="status"
                    />
                    {{ status }}
                    </label>
            </div>
            <!--체크박스 선택 상태 값 -->
            <div class="mt-3">
                <p>선택된 상태</p>
                <ul>
                    <li v-for="(item,index) in pickedStatus" :key="index">{{ item }}</li>
                </ul>
            </div>
        </div>

        <!--거래처명 검색-->
        <div class="row align-items-center mb-3">
            <label class="col-sm-2 col-form-label fw-bold" >거래처명</label>
            <div class="col-sm-4">
                <material-input 
                    id="clientSearch" 
                    label="거래처명" 
                    v-model="clientName" @click="openModal"/>
                <Modal :isShowModal="isShowModal" @closeModal="closeModal">
                    <template v-slot:list>
                        <!--모달 안에 거래처 목록 출력-->
                        <div>
                            <ul>
                                <li v-for="client in clientList" :key="client.com_name">
                                    <button class="btn btn-light" @click="selectClient(client.com_name)">
                                        {{ client.com_name }}
                                    </button>

                                </li>
                            </ul>
                        </div>
                        
                    </template>
                </Modal>
            </div>    
        </div>
        <!--주문서명 검색 -->
        <div  class="row align-items-center mb-3">
            <label class="col-sm-2 col-form-label fw-bold">주문서명</label>
            <div class="col-sm-6">
                <material-input 
                id="orderSearch" 
                label="주문서명"
                v-model="orderName" />
            </div>
        </div>
         <!--주문일자 검색 -->
        <div class="row align-items-center mb-3">
            <label class="col-sm-2 col-form-label fw-bold">주문일자</label>
            <div class="col-sm-4">
                <material-input 
                type="date" 
                id="startDate"
                v-model="startDate"/>
            </div>
            <div class="col-sm-1 text-center">~</div>
            <div class="col-sm-4">
                <material-input 
                type="date" 
                id="endDate" 
                v-model="endDate" />
            </div>
        </div>
        <!--검색 및 초기화-->
        <div class="row align-items-center mb-3">
            <button type="button" class="btn btn-warning"  @click="searchOrderlists" >검색</button>
            <button type="button" class="btn btn-secondary"  @click="resetSearch" >초기화</button>
        </div>
        <!--추가 -->
        <button type="button" class="btn btn-secondary" @click="addOrder">추가</button>
       
    </div>
    <!--orderList  컴포넌트 : 등록 또는  수정 -->
<orderList :filters="filters"  @save="saveOrder"/>


</template>

<script>
import MaterialInput from "@/components/MaterialInput.vue";
import Modal from "@/views/natureBlendComponents/modal/Modal.vue";
import orderList from "./orderList.vue";
import axios from "axios";

 

export default{
    name :"orderlistSearch",
    components:{
            MaterialInput,
            Modal,
            orderList,
    },
    data(){
        return{
            isShowModal : false,

            //주문서상태 체크 박스 관련 데이터
            statusList:["등록","진행중","완료"], //상태 리스트
            pickedStatus:[], //체크박스 선택 값 저장

            //검색 필터 데이터
            clientList:[], //거래처명 목록 저장
            clientName : "", // 거래처명 선택한것 
            orderName:"", // 주문서명
            startDate:"", //주문날짜 시작 날짜
            endDate:"", //주문날짜 끝 날짜

            filters: {},
            
        };
    },

    methods:{
        async openModal(){
            const response = await axios.get("/api/clients"); //서버호출
            this.clientList = response.data; //거래처목록 저장
            this.isShowModal = !this.isShowModal; //모달 열기 
        },
        selectClient(client){
            this.clientName = client; // 선택된 거래처명 설정
            this.isShowModal = false;
            
        },
        closeModal() {
            this.isShowModal = false
        },
        //초기화
        resetSearch(){
            this.pickedStatus = [];
            this.clientName = ""; // 공백 문자 대신 빈 문자열로 초기화
            this.orderName = "";  // 공백 문자 대신 빈 문자열로 초기화
            this.startDate = "";  // 빈 문자열로 초기화
            this.endDate = "";    // 빈 문자열로 초기화
            this.orderData = {};  // 객체 초기화
            //console.log(this.orderData);
        },
        searchOrderlists(){
            const statusMap ={
                등록:"update",
                진행중:"continue",
                완료:"done",
            }

            const dbStatus = this.pickedStatus.map(status=>statusMap[status]);
            this.filters = {
                orderStatus : dbStatus,
                clientName : this.clientName,
                orderName : this.orderName,
                startDate : this.startDate,
                endDate : this.endDate,
            };

            this.$emit('updateFilters',this.filters);
        },
        addOrder(){
            this.orderData = {};
        },
        saveOrder(data){
            console.log('Order saved:',data);
        }, 
    },
};
</script>
<style scoped>
.text-center {
  text-align: center;
}
</style>