<template>
    <div class="container-fluid py-4">
    <!--검색 폼 -->
    <h2>제품출고 등록</h2>
    <h4>주문서 조회</h4>
    <div class= "main-container">
        <div class= "pt-5 pb-5">
                <!--거래처명 검색-->
                <div class="row align-items-center mb-3">
                    <label class="col-sm-2 col-form-label fw-bold" >거래처명</label>
                    <div class="col-sm-4">
                        <input 
                            id="clientSearch"  class="form-control border p-2"
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
    <!-- <div class="grid-container" v-show="rowData.length != 0"> -->
    <div class="grid-container" v-show="rowData.length != 0">
        <ag-grid-vue
        :rowData="rowData"
        :columnDefs="columnOrderlist"
        :theme="theme"
        @grid-ready="onGridReady"
        :noRowsOverlayComponent="noRowsOverlayComponent"
        @rowClicked="onOrderRowClicked"
        :pagination="true"
        :paginationPageSize="10"
    />
    </div>
    <div style="display: none">
        <CustomNoRowsOverlay/>
    </div>
    <div class="container-fluid py-4">
        <h4 v-show="rowDataOrder.length != 0">미출고조회</h4>
        <div class="d-flex">
            <div>
                <div class="grid-container" v-show="rowDataOrder.length != 0">
                <ag-grid-vue
                style ="width: 850px; height: 500px;"
                :rowData="rowDataOrder"
                :columnDefs="columnOrder"
                :theme="theme"
                @grid-ready="onGridReady"
                :noRowsOverlayComponent="noRowsOverlayComponent"
                @rowClicked="onDisoutputRowClicked"
                :pagination="true"
                :paginationPageSize="10"
                />
                </div>
                <div style="display: none">
                    <CustomNoRowsOverlay/>
                </div>
            </div>
            <div>
                <div class="grid-container" v-show="rowDataOrder.length != 0">
                <ag-grid-vue
                style ="width:650px; height: 500px;"
                :rowData="rowDataLot"
                :columnDefs="columnLot"
                :theme="theme"
                @grid-ready="onGridReady"
                :noRowsOverlayComponent="noRowsOverlayComponent"
                :editType="'fullRow'"
                :row-selection="'multiple'"
                :pagination="true"
                :paginationPageSize="10"
                />
                </div>
                <div style="display: none">
                    <CustomNoRowsOverlay/>
                </div>
                <!--담당자 선택 -->
                <div class="row align-items-center mb-3" v-show="rowDataOrder.length != 0">
                    <label class="col-sm-2 col-form-label fw-bold" >담당자</label>
                    <div class="col-sm-4">
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
                
                <!--검색 및 초기화-->
                <div class="mb-3 pt-2 text-center" v-show="rowDataOrder.length != 0">
                    <material-button  color="warning" class="button" @click="processData">출고</material-button>
                    <material-button color="warning" class="button" @click="resetLot">초기화</material-button>
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
            CustomNoRowsOverlay,
            
    },
    data(){
        return{
            

            //검색 필터 데이터
            orderName:"", // 주문서명
            startDate:"", //주문날짜 시작 날짜
            endDate:"", //주문날짜 끝 날짜
            //거래처 모달 
            searchCom:"", // 저장 될 거래처 명 
            selectedCom: "", //선택된 거래처 명

          

            //주문서 조회 결과 
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
            ],
            //주문조회
            rowDataOrder : [],
            columnOrder : [
                {headerName :"주문번호",field: 'order_num' },
                {headerName :"제품코드",field: 'product_code'},
                {headerName :"제품명",field: 'product_name'},
                {headerName :"주문수량",field: 'order_amount'},
                {headerName :"출고량",field: 'output_amount'},
                {headerName :"미출고량",field: 'disorder_amount'}, // 커리 보낼때 as (alias)로 보내면 해당 이름이 된다.
                {headerName :"상태여부",field: 'order_status'}
            ],

            //출고 시킬 제품 선택 
             //직원  모달
            searchEmpName:"", // 저장될 직원 명 
            selectedEmpName:"", //선택될 직원 명 

            rowDataLot :[],
            columnLot :[
            { headerName: "체크",
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
        openModal(modalType){
            this.isShowModal[modalType] = true; 
            console.log(`${modalType} modal open`);
        },
        
        confirm(modalType){
            if (modalType === 'client') {
                this.searchCom = this.selectedCom;
            } else if (modalType === 'emp') {
                this.searchEmpName = this.selectedEmpName;
            }
            this.closeModal(modalType); // 모달 닫기
        },
        closeModal(modalType) {
            this.isShowModal[modalType] = false;
        },
        //주문서검색 초기화
        resetSearch(){
            this.searchCom = ""; // 공백 문자 대신 빈 문자열로 초기화
            this.orderName = "";  // 공백 문자 대신 빈 문자열로 초기화
            this.startDate = "";  // 빈 문자열로 초기화
            this.endDate = "";    // 빈 문자열로 초기화
            this.orderData = {};  // 객체 초기화
            this.rowData =[];
            //console.log(this.orderData);

            this.searchEmpName="";
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
        //주문서 클릭 시 해당 주문서의 미출고 주문 출력 
        async onOrderRowClicked(row) {
            
            let order = row.data;
           
            let result = await axios.get(`${ajaxUrl}/output/disoutput/${order.orderlist_num}`)
                                    .catch(err => console.log(err));
            // this.rowDataOrder = result.data;
            this.rowDataOrder = result.data.map(function(val) {
                return {
                    ...val,
                    com_name: row.data.com_name,
                };
            });

            console.log("rowDataOrder:",this.rowDataOrder);
        },
        // 미출고주문에 해당하는 제품의 lot 들
        async onDisoutputRowClicked(row){
            console.log("rows:",row)
            console.log("클릭된 미출고주문 데이터",row.data.order_num);
            let disorder = row.data;
            let result = await axios.get(`${ajaxUrl}/output/product/${disorder.product_code}`)
                                    .catch(err => console.log(err))

                                    this.rowDataLot = result.data;
            this.rowDataLot = result.data.map((col) => ({
                ...col,
                input_date: this.dateFormat(col.input_date, "yyyy-MM-dd"),
                com_name: row.data.com_name,
                order_num : row.data.order_num,
                order_amount : row.data.order_amount,
                disorder_amount : row.data.disorder_amount,
                }));
            this.currentDisorder = disorder;

            console.log("rowDataLot:",this.rowDataLot)
            
           
        },

        async processData(){
            //체크된 행만 처리 
            const selectedRows = this.gridApi.getSelectedRows();  
            let clientName = selectedRows[0].com_name;
            let orderNum = selectedRows[0].order_num;
            //console.log(selectedRows[0].com_name, selectedRows[0].order_num)
            console.log("disorder:",selectedRows[0].disorder_amount);

            let outputNums = []
            let productLots = []
          

    
            selectedRows.forEach(row =>{
                 console.log( row.output_num,row.product_lot,row.com_name, row.order_num,this.searchEmpName);
                 // row.output_num,row.product_lot,  배열로 만들어서 보내고 row.com_name, row.order_num, this.searchEmpName 객체로 보내기 
                 outputNums.push(Number(row.output_num));
                 productLots.push(row.product_lot);


            })

            const totalOutput = outputNums.reduce((sum,value)=> sum + Number(value),0);
            if(selectedRows.length > 0 && Number(selectedRows[0].disorder_amount) < totalOutput){
                this.$notify({
                    text: '출고수는 재고수보다 많을 수 없습니다.',
                    type: 'error',
                });
                return; 
            }

            if(!this.searchEmpName || totalOutput == 0){
                this.$notify({ text: '출고수량 과 담당자를 입력 해 주세요.', type: 'error' });
                return;
            }

            let outputInfo = {
                product_lot : JSON.stringify(productLots),
                output_amount : JSON.stringify(outputNums),
                order_num : orderNum,
                com_name : clientName,
                name : this.searchEmpName.name,

            }
            console.log(outputInfo);
            let result =
                await axios.post(`${ajaxUrl}/output/insert`, outputInfo)
                            .catch(err => console.log(err));
                            console.log(result.data);
            if(result.statusText === 'OK'){
                this.$notify({
                    text: `출고가 완료되었습니다.`,
                    type: 'success',
                }); 
                this.resetSearch();
                this.resetLot();
                this.rowDataLot = [];
                this.rowDataOrder = [];
             
            }

            
        },
        //LOT제품 초기화 
        resetLot(){
            // 체크박스 해제
            this.gridApi.deselectAll();
             // 입력 필드 초기화
            this.searchEmpName = ""; // 담당자 초기화
            this.clientName = "";    // 고객명 초기화

            // 출력 수량 초기화
            const rows = this.gridApi.getRenderedNodes();
            rows.forEach(rowNode => {
                if (rowNode.data.output_num !== undefined) {
                    rowNode.data.output_num = ""; // 출력 수량 초기화
                    this.gridApi.refreshCells({ rowNodes: [rowNode], columns: ['output_num'] });
                }
            });
            
        },

        // output_num 셀 값이 변경될 때마다 실행되는 함수
        onCellValueChanged(event){
            if(event.colDef.field === 'output_num'){
                const updateOutput = event.newValue;
                const stock = event.data.input_amount;

                //출고수가 재고수 보다 많으면 
                if(updateOutput > stock){
                    this.$notify({
                        text: `'출고수는 재고수보다 많을 수 없습니다.'`,
                        type: 'error',
                    });

                     // 셀 값을 원래대로 되돌리기
                    event.node.setDataValue('output_num', event.oldValue);
                }
            }
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
