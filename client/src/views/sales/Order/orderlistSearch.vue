<template>
    <div class="container-fluid py-4">
        <!--검색 폼 -->
        <h2>주문서 조회</h2>
            <div class= "main-container">
                 <!--주문서 상태 체크 박스-->
                    <div class="mb-3">
                        <label class="col-sm-2 col-form-label fw-bold">주문상태</label>
                        <div>
                            <label class="me-3" v-for="status in statusList" :key="status">
                                {{ status }}
                            <input 
                                :value="status"
                                type="checkbox"
                                v-model="pickedStatus"
                            >
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
                        <input 
                            id="clientSearch"  class="form-control border p-2"
                            v-model="clientName" @click="openModal"/>
                        <Modal :isShowModal="isShowModal" @closeModal="closeModal">
                            <template v-slot:list>
                                <!--모달 안에 거래처 목록 출력-->
                                <div>
                                    <ul>
                                        <li v-for="client in clientList" :key="client.com_name">
                                            <p class="btn btn-light" @click="selectClient(client.com_name)">
                                                {{ client.com_name }}
                                            </p>

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
                        <input 
                        id="orderSearch" class="form-control border p-2"
                        v-model="orderName" />
                    </div>
                </div>
                <!--주문일자 검색 -->
                <div class="row align-items-center mb-5">
                    <label class="col-sm-2 col-form-label fw-bold">주문일자</label>
                    <div class="col-sm-4">
                        <input 
                        type="date" 
                        id="startDate" class="form-control border p-2"
                        v-model="startDate"/>
                    </div>
                    <div class="col-sm-1 text-center">~</div>
                    <div class="col-sm-4">
                        <input 
                        type="date" 
                        id="endDate" class="form-control border p-2"
                        v-model="endDate" />
                    </div>
                </div>
            </div>
        <!--검색 및 초기화-->
        <div class="mb-3 text-center">
            <material-button size="sm" color="warning" class="button" @click="searchOrderlists">검색</material-button>
            <material-button size="sm" color="warning" class="button" @click="resetSearch">초기화</material-button>
        </div>
        <!--추가 -->
        <!-- <button type="button" class="btn btn-secondary" @click="addOrder">추가</button> -->
       
    </div>
    <!--orderList  컴포넌트 : 등록 또는  수정 -->
<orderList :filters="filters"/>


</template>

<script>
import MaterialButton from "@/components/MaterialButton.vue";
import Modal from "@/views/natureBlendComponents/modal/Modal.vue";
import orderList from "./orderList.vue";
import axios from "axios";

 

export default{
    name :"orderlistSearch",
    components:{
            MaterialButton,
            Modal,
            orderList,
    },
    data(){
        return{
            isShowModal : false,
            modalTitle: '거래처 목록',

            //주문서상태 체크 박스 관련 데이터
            statusList:["등록","진행중","완료"], //상태 리스트
            pickedStatus:[], //체크박스 선택 값 저장

            //검색 필터 데이터
            clientList:[], //거래처명 목록 저장
            clientName : "", // 거래처명 선택한것 
            orderName:"", // 주문서명
            startDate:"", //주문날짜 시작 날짜
            endDate:"", //주문날짜 끝 날짜

            filters: [],
            
        };
    },
    

    methods:{
        async openModal(){
            console.log("modal 열림")
            const response = await axios.get("/api/orderlist/clients") //서버호출
                                        .catch(err=> console.log(err));
            this.clientList = response.data; //거래처목록 저장
            this.isShowModal = !this.isShowModal; //모달 열기 
        },
        selectClient(client){
            
            this.clientName = client; // 선택된 거래처명 설정
            console.log(client);
            console.log("this.clientName:",this.clientName);
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
                "등록":"update",
                "진행중":"continue",
                "완료":"done"
            }
            
            const dbStatus = this.pickedStatus.map(status=>statusMap[status]);
            this.filters = {
                orderStatus : dbStatus,
                clientName : this.clientName,
                orderName : this.orderName,
                startDate : this.startDate,
                endDate : this.endDate,
            };
            //console.log(this.filters);
        },
        // addOrder(){
        //     this.orderData = {};
        // },
        
    },
    
};
</script>
<style lang="scss" scoped>
.main-container{
    background-color:  #e9ecef;
    border-radius: 10px;
}

.text-center {
  text-align: center;
}

.button {
  margin: 0 10px; /* 버튼 사이 간격 추가 */
}

input {
      background-color: $white;
}
</style>