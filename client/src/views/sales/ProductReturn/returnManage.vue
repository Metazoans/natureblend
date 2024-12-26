<template>
    <div class="container-fluid py-4">
    <!--검색 폼 -->
    <h2>제품반품 등록</h2>
    <h4>주문서 조회</h4>
        <div class= "main-container">
            <div class= "pt-5 pb-5">
                    <!--거래처명 검색-->
                    <div class="row align-items-center ms-3 mb-3">
                        <label class="col-sm-2 col-form-label fw-bold" >거래처명</label>
                        <div class="col-sm-6 d-flex align-items-center">
                            <input 
                                id="clientSearch"  class="form-control me-2"
                                v-model="searchCom.com_name" @click="openModal('client')" readonly/>
                                <Modal
                                    :isShowModal="isShowModal.client"
                                    :modalTitle="'거래처선택'"
                                    :noBtn="'닫기'"
                                    :yesBtn="'선택'"
                                    @closeModal="closeModal('client')"
                                    @confirm="confirm('client')"
                                >
                                <template v-slot:list>
                                    <ComList v-show="isShowModal.client" @selectclient="selectclient"/>
                                </template>
                                </Modal>
                        </div> 
                                   <!--검색 및 초기화-->
                        <div class="col-sm-10 text-end">
                            <material-button size="md" color="success" class="me-2" @click="searchOrderlists">검색</material-button>
                            <material-button size="md" color="warning"  @click="resetSearch">초기화</material-button>
                        </div>   
                    </div>
             
            </div>
        </div>
    </div>
    <!-- <div class="grid-container" v-show="rowData.length != 0"> -->
    <div class="grid-container">
        <ag-grid-vue
        :rowData="rowData"
        :columnDefs="columnOrderlist"
        :theme="theme"
        @grid-ready="onGridReady"
        :noRowsOverlayComponent="noRowsOverlayComponent"
        @rowClicked="onOrderRowClicked"
        rowSelection="multiple"
        :pagination="true"
        :paginationPageSize="10"
    />
    </div>
    <div style="display: none">
        <CustomNoRowsOverlay/>
    </div>
    <div class="container-fluid py-4">
        <h4>출고 완료 된 주문 조회</h4>
        <div class="d-flex">
            <div>
                <div class="grid-container">
                <ag-grid-vue
                style ="width: 850px; height: 500px;"
                :rowData="rowDataOutputOrder"
                :columnDefs="columnOutputOrder"
                :theme="theme"
                @grid-ready="onGridReady"
                :noRowsOverlayComponent="noRowsOverlayComponent"
                @rowClicked="onDisoutputRowClicked"
                rowSelection="multiple"
                :pagination="true"
                :paginationPageSize="10"
                />
                </div>
                <div style="display: none">
                    <CustomNoRowsOverlay/>
                </div>
            </div>
            <div class= "select-container" >
                    <div class="d-flex flex-column justify-content-center ps-5 pt-5" style="height: 200px;">
                            <!--담당자 선택 -->
                        <div class="row align-items-center mb-3">
                            <label class="col-sm-3  col-form-label fw-bold" >담당자</label>
                            <div class="col-sm-9 d-flex">
                                <input 
                                    id="EmpName"  class="form-control border p-2" 
                                    v-model="searchEmpName.name" @click="openModal('emp')" readonly/>
                                    <Modal
                                        :isShowModal="isShowModal.emp"
                                        :modalTitle="'담당자선택'"
                                        :noBtn="'닫기'"
                                        :yesBtn="'선택'"
                                        @closeModal="closeModal('emp')"
                                        @confirm="confirm('emp')"
                                    >
                                    <template v-slot:list>
                                        <EmpList v-show="isShowModal.emp" @selectemp="selectemp"/>
                                    </template>
                                    </Modal>
                            </div>    
                        </div>
                        <!--반품수량-->
                        <div class="row align-items-center mb-3">
                            <label class="col-sm-3  col-form-label fw-bold" >반품수량</label>
                            <div class="col-sm-9 d-flex">
                                <input 
                                    id="returnNum"  class="form-control border p-2" 
                                    v-model="returnNum"/>
                            </div>    
                        </div>
                        <!--반품사유-->
                        <div class="row align-items-center mb-3">
                            <label class="col-sm-3  col-form-label fw-bold" >반품사유</label>
                            <div class="col-sm-9 d-flex">
                                <input 
                                    id="ReturnReason"  class="form-control border p-2" 
                                    v-model="searchReturnReason" @click="openModal('returns')" readonly/>
                                    <Modal
                                        :isShowModal="isShowModal.returns"
                                        :modalTitle="'반품사유'"
                                        :noBtn="'닫기'"
                                        :yesBtn="'선택'"
                                        @closeModal="closeModal('returns')"
                                        @confirm="confirm('returns')"
                                    >
                                    <template v-slot:list>
                                        <ReturnList v-show="isShowModal.returns" @selectreturn="selectreturn"/>
                                    </template>
                                    </Modal>
                            </div>    
                        </div>
                        
                    </div> 
                    <!--검색 및 초기화-->
                    <div class=" pt-5 text-center ">
                        <material-button  color="success" class="button" @click="tempInputInfo">입력</material-button>
                        <material-button color="warning" class="button" @click="resetEmpWar">초기화</material-button>
                    </div>
            </div>
       </div>
    </div>
        
    
</template>

<script>
import MaterialButton from "@/components/MaterialButton.vue";
import Modal from "@/views/natureBlendComponents/modal/Modal.vue";
import ComList from "@/views/sales/Order/clientModal.vue";
import EmpList from "@/views/sales/Order/EmpModal.vue";
import ReturnList from "@/views/sales/ProductReturn/ReturnModal.vue"
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
            EmpList,
            ReturnList,
            CustomNoRowsOverlay,
            
    },
    data(){
        return{
            

            //검색 필터 데이터
            //거래처 모달 
            searchCom:"", // 저장 될 거래처 명 
            selectedCom: "", //선택된 거래처 명

          

            //주문서 조회 결과 
            statusMap: {         // DB 상태값과 화면 상태명 매핑
                "update": "등록",
                "continue": "진행중",
                "done": "완료",
            },
            noRowsOverlayComponent: 'CustomNoRowsOverlay',
            filteredOrderlist : [],
            theme : theme,
            rowData : [],
            columnOrderlist : [
            { headerName : "주문서번호", field:'orderlist_num'},
            { headerName : "주문서명", field:'orderlist_title'},
            { headerName : "거래처명",field:'com_name'},
            { headerName : "담당자",field:'name'},
            { headerName : "주문일자",field:'order_date'},
            { headerName : "납기일자",field:'due_date'},
            { headerName : "진행상태",field:'orderlist_status'},
            ],
            //주문조회
            statusOrderMap: {         // DB 상태값과 화면 상태명 매핑
                "preparing": "미출고",
                "semiShipped": "부분출고",
                "shipped": "출고완료",
            },
            rowDataOutputOrder : [],
            columnOutputOrder : [
                {headerName :"주문번호",field: 'order_num' },
                {headerName :"제품코드",field: 'product_code'},
                {headerName :"제품명",field: 'product_name'},
                {headerName :"주문수량", field: 'order_amount'},
                {headerName :"출고량", field: 'output_amount'},
                {headerName :"미출고량",field: 'disorder_amount'}, // 커리 보낼때 as (alias)로 보내면 해당 이름이 된다.
                {headerName :"개당가격",field: 'per_price'},
                {headerName :"상태여부",field: 'order_status'}
            ],

            //출고 시킬 제품 선택 
             //직원  모달
            searchEmpName:"", // 저장될 직원 명 
            selectedEmpName:"", //선택될 직원 명 

            selectedReturnCode: "", // 선택한 반품 코드 
            searchReturnCode : "", // 저장될 반품 코드
            selectedReturnReason:"", // 선택될 반품 이유
            searchReturnReason : "", // 저장될 반품 이유 

            rowDataLot :[],
            columnLot :[
            {headerName: "",
            headerCheckboxSelection: true,
            field: "check",
            resizable: false,
            editable: true,
            sortable: false,
            checkboxSelection: true,
            //cellClass: "custom-cell"
            },
            {headerName :"제품LOT번호",field: 'product_lot'},
            {headerName :"제품 재고수 ",field: 'input_amount'},
            {headerName :"제품제조일자 ",field: 'input_date'},

            { headerName: "출고수",
            field: "output_num",
            resizable: false,
            editable: true,
            sortable: false,
            // 셀 값이 변경될 때마다 실행되는 함수
            onCellValueChanged: this.onCellValueChanged
            },
            ],

            


            isShowModal: {
            client: false, // 거래처 모달
            emp: false, // 직원 모달
            },

            
           

            
        }
    },
 

    methods:{
        selectclient(client){
            this.selectedCom = client; 
        },
        selectemp(emp){
        this.selectedEmpName = emp;
        },
        selectreturn(returns){
        this.selectedReturnCode = returns.return_code;
        this.selectedReturnReason = returns.return_reason;
        },
        openModal(modalType){
            this.isShowModal[modalType] = true; 
            console.log(`${modalType} modal open`);
        },
        
        confirm(modalType){
            if (modalType === 'client') {
                this.searchCom = this.selectedCom;
            } else if (modalType === 'emp') {
                this.searchEmpName = this.selectedEmpName;
            }else if (modalType === 'returns') {
                this.searchReturnCode = this.selectedReturnCode;
                this.searchReturnReason = this.selectedReturnReason;
            }
            this.closeModal(modalType); // 모달 닫기
        },
        closeModal(modalType) {
            this.isShowModal[modalType] = false;
        },
        //주문서검색 초기화
        resetSearch(){
            this.searchCom = ""; // 공백 문자 대신 빈 문자열로 초기화
            
            this.orderData = {};  // 객체 초기화
            this.rowData =[];
            //console.log(this.orderData);

            this.searchEmpName="";
        },
        //주문서조회;
        async searchOrderlists(){
        this.filters  = {
            clientName : this.searchCom,
            
        }
        console.log(this.filters);

        let result = await axios.put(`${ajaxUrl}/orderlist/search`,this.filters )
                                .catch(err => console.log(err));
        
        this.rowData = result.data;
        this.rowData = result.data.map((col) => ({
            ...col,
            order_date: this.dateFormat(col.order_date, "yyyy-MM-dd"),
            due_date: this.dateFormat(col.due_date, "yyyy-MM-dd"),
            orderlist_status : this.statusMap[col.orderlist_status],
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
    //주문서 클릭 시 해당 주문서의 미출고 주문 출력 
    async onOrderRowClicked(row) {
        
        let order = row.data;
        
        let result = await axios.get(`${ajaxUrl}/shippedOrderInfo/${order.orderlist_num}`)
                                .catch(err => console.log(err));
        this.rowDataOutputOrder = result.data;
        this.rowDataOutputOrder = result.data.map((col) => ({
            ...col,
            order_status : this.statusOrderMap[col.order_status],
            })
        );
        console.log("rowDataOutputOrder:",this.rowDataOutputOrder);
    },
        

  

            

      

        
    
    },//method
    
};
</script>
<style lang="scss" scoped>
.main-container{
    background-color:  #e9ecef;
    border-radius: 10px;
    
}
.d-flex {
  display: flex;
  justify-content: space-between;
  //gap: 5px;
  text-align: center;
}

.custom-cell {
  padding: 2px !important;
}

/* 버튼이 한 줄에 정렬되도록 조정 */
.row {
  display: flex;
  align-items: center; /* 수직 정렬 */
}
.text-end {
  text-align: right; /* 오른쪽 정렬 */
}
.col-sm-6 {
    display: flex;
    align-items: center; /* 세로 가운데 정렬 */
}
.material-button {
    display: inline-block; /* 버튼을 가로로 정렬 */
    margin: 0 5px; /* 버튼 간 여백 */
}
.select-container{
    background-color:  #e9ecef;
    border-radius: 10px;
    width: 650px;
    height: 400px;
    margin-top: 70px;
}

.text-center {
  text-align: center;
}

.button {
  margin: 0 10px; /* 버튼 사이 간격 추가 */
}

/* 일반 input 태그 스타일 */
input {
  background-color: #ffffff; /* 배경색 흰색 */
  border: solid 1px #ced4da; /* 테두리 색상 */
  color: #495057; /* 텍스트 색상 */
}
/* readonly 상태의 input 태그 스타일 */
input:read-only {
  background-color: #ffffff; /* 배경색 흰색 고정 */
  color: #495057; /* 텍스트 색상 유지 */
  cursor: not-allowed; /* 읽기 전용 표시를 위한 커서 */
}

/* input 포커스 상태에서도 배경색 유지 */
input:focus {
  background-color: #ffffff; /* 포커스 시 배경색 흰색 유지 */
  border-color: #86b7fe; /* 선택 시 테두리 색상 약간 강조 */
  outline: none; /* 기본 브라우저 포커스 아웃라인 제거 */
}

/* readonly input 요소가 포커스되어도 스타일 유지 */
input:read-only:focus {
  background-color: #ffffff; /* 배경색 흰색 고정 */
  border-color: #ced4da; /* readonly 상태에서는 테두리 기본값 */
  outline: none; /* 포커스 아웃라인 제거 */
}
</style>
