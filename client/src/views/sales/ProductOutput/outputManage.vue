<template>
    <div class="container-fluid py-4">
        <!--검색 폼 -->
        <h2>출고 관리</h2>
        <h4>주문서 조회</h4>
        <div class= "main-container">
            <div class= "pt-5 pb-5">
                    <!--거래처명 검색-->
                    <div class="row align-items-center mb-3">
                        <label class="col-sm-2 col-form-label fw-bold" >거래처명</label>
                        <div class="col-sm-4">
                            <input 
                                id="clientSearch"  class="form-control border p-2"
                                v-model="searchCom.com_name" @click="openModal"/>
                                <Modal
                                    :isShowModal="isShowModal"
                                    :modalTitle="'거래처선택'"
                                    :noBtn="'닫기'"
                                    :yesBtn="'선택'"
                                    @closeModal="closeModal()"
                                    @confirm="confirm()"
                                >
                                <template v-slot:list>
                                    <ComList v-show="isShowModal" @selectclient="selectclient"/>
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
                <div class="pb-3 text-center">
                    <material-button size="sm" color="warning" class="button" @click="searchOrderlists">검색</material-button>
                    <material-button size="sm" color="warning" class="button" @click="resetSearch">초기화</material-button>
                </div>
            </div>
        </div>

        <div class="grid-container" >
            <ag-grid-vue
            :rowData="rowData"
            :columnDefs="columnOrderlist"
            :theme="theme"
            @grid-ready="onGridReady"
            :noRowsOverlayComponent="noRowsOverlayComponent"
            @rowClicked="onRowClicked"
            :pagination="true"
            :paginationPageSize="10"
        />
        </div>
        <div style="display: none">
            <CustomNoRowsOverlay/>
        </div>
        <div class="grid-container" >
            <ag-grid-vue
            :rowData="rowDataOrder"
            :columnDefs="columnOrder"
            :theme="theme"
            @grid-ready="onGridReady"
            :noRowsOverlayComponent="noRowsOverlayComponent"
            @rowClicked="onRowClicked"
            :pagination="true"
            :paginationPageSize="10"
        />
        </div>
        <div style="display: none">
            <CustomNoRowsOverlay/>
        </div>
    



</template>

<script>
import MaterialButton from "@/components/MaterialButton.vue";
import Modal from "@/views/natureBlendComponents/modal/Modal.vue";
import ComList from "@/views/sales/Order/clientModal.vue";
import theme from "@/utils/agGridTheme";
import userDateUtils from '@/utils/useDates.js';
import CustomNoRowsOverlay from "@/views/natureBlendComponents/grid/noDataMsg.vue";
import axios from "axios";
import { ajaxUrl } from '@/utils/commons.js';

export default{
    name :"orderlistSearch",
    components:{
            MaterialButton,
            Modal,
            ComList,
            CustomNoRowsOverlay,
    },
    data(){
        return{
            // 주문서 조회창 
            isShowModal : false,

            //검색 필터 데이터
            orderName:"", // 주문서명
            startDate:"", //주문날짜 시작 날짜
            endDate:"", //주문날짜 끝 날짜

            searchCom:"", // 저장 될 거래처 명 
            selectedCom: "", //선택된 거래처 명

          

            //주문서 조회 결과 
            noRowsOverlayComponent: 'CustomNoRowsOverlay',
            filteredOrderlist : [],
            theme : theme,
            rowData : [],
            columnOrderlist : [
            { headerName : "주문서코드", field:'orderlist_num'},
            { headerName : "주문서명", field:'orderlist_title'},
            { headerName : "거래처명",field:'com_name'},
            { headerName : "담당자",field:'name'},
            { headerName : "주문일자",field:'order_date'},
            { headerName : "납기일자",field:'due_date'},
            ],
            //주문조회
            rowDataOrder : [],
            // columnOrder : [
            //     {headerName :"주문코드",field: order_num},
            //     {headerName :"제품코드",field: product_code},
            //     {headerName :"제품명",field: product_name},
            //     {headerName :"주문수량",field: order_amount},
            //     {headerName :"출고량",field: output_amount},
            //     {headerName :"미출고량",field: disorder_amount}, // 커리 보낼때 as (alias)로 보내면 해당 이름이 된다.
            //     {headerName :"상태여부",field: order_status}
            // ],
           

            
        }
    },

    methods:{
        selectclient(client){
            this.selectedCom = client; 
        },
        async openModal(){
            console.log("modal 열림")
            this.isShowModal = !this.isShowModal; //모달 열기 
        },
        
        confirm(){
            this.searchCom = this.selectedCom;
            this.closeModal();
        },
        closeModal() {
            this.isShowModal = false
        },
        //초기화
        resetSearch(){
            this.clientName = ""; // 공백 문자 대신 빈 문자열로 초기화
            this.orderName = "";  // 공백 문자 대신 빈 문자열로 초기화
            this.startDate = "";  // 빈 문자열로 초기화
            this.endDate = "";    // 빈 문자열로 초기화
            this.orderData = {};  // 객체 초기화
            //console.log(this.orderData);
        },
        async searchOrderlists(){
            this.filters  = {
                clientName : this.searchCom,
                orderName : this.orderName,
                startDate : this.startDate,
                endDate : this.endDate,
            }

            console.log(this.filters);
            let result = await axios.put(`${ajaxUrl}/output/search`,this.filters )
                                    .catch(err => console.log(err));
            
            this.rowData = result.data;
            this.rowData = result.data.map((col) => ({
                ...col,
                order_date: this.dateFormat(col.order_date, "yyyy-MM-dd"),
                due_date: this.dateFormat(col.due_date, "yyyy-MM-dd"),
                })
            );  
        },
        dateFormat(value, format) {
          return userDateUtils.dateFormat(value, format);
        },
            


        onGridReady(params){
            this.gridApi = params.api;
            this.gridApi.sizeColumnsToFit();
        },
        OrderGridReady(params){
            this.gridApi = params.api;
            this.gridApi.sizeColumnsToFit();
        },

        onRowClicked(row) {
            console.log("클릭된 셀 데이터:",row.data);
            // let order = row.data;
            
        },
                
        
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