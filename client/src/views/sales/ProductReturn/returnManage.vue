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
                        <div class="col-sm-">
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
                        <div class="button-container d-flex justify-content-end">
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
        <div class="row">
            <div class="col-lg-8">
                <div class="grid-container">
                <ag-grid-vue
                style ="width: 850px; height: 500px;"
                :rowData="rowDataOutputOrder"
                :columnDefs="columnOutputOrder"
                :theme="theme"
                @grid-ready="onGridReady"
                :noRowsOverlayComponent="noRowsOverlayComponent"
                @rowClicked="onOutputReturn"
                rowSelection="multiple"
                :pagination="true"
                :paginationPageSize="10"
                />
                </div>
                <div style="display: none">
                    <CustomNoRowsOverlay/>
                </div>
            </div>
            <div class= "col-lg-4 ps-4 " >
                <div class="select-container p-4">
                    <div class= "form-section mb-4">
                            <!--담당자 선택 -->
                        <div class="row align-items-center mb-3">
                            <label class="col-sm-3  col-form-label fw-bold" >담당자</label>
                                <div class="col-sm-9">
                                    <input 
                                    id="EmpName"  class="form-control" 
                                    v-model="searchEmpName" @click="openModal('emp')" readonly/>
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
                        <div class="form-section mb-4">
                            <label class="col-sm-3  col-form-label fw-bold" >반품수량</label>
                                <input 
                                    id="returnNum"  class="form-control" 
                                    v-model="returnNum"/>
                        </div>
                        <!--반품사유-->
                        <div class="form-section">
                            <label class="col-sm-3  col-form-label fw-bold" >반품사유</label>
                                <div class="col-sm-9">
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
                    <div class="text-center pt-4">
                        <material-button  color="success" class=" me-3" @click="returninstall">등록</material-button>
                        <material-button color="warning"  @click="resetEmpWar">초기화</material-button>
                    </div>
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
            
            rowDataOutputOrder : [],
            columnOutputOrder : [
                {headerName :"주문번호",field: 'order_num' },
                {headerName :"출고번호",field: 'output_num'}, // 커리 보낼때 as (alias)로 보내면 해당 이름이 된다.
                {headerName :"제품코드",field: 'product_code'},
                {headerName :"제품명",field: 'product_name'},
                {headerName :"주문수량", field: 'order_amount'},
                {headerName :"출고량", field: 'output_amount'},
                {headerName :"개당가격",field: 'per_price'},
                {headerName :"출고날짜",field: 'output_date'}
            ],

            //출고 시킬 제품 선택 
             //직원  모달
            searchEmpName:"", // 저장될 직원 명 
            selectedEmpName:"", //선택될 직원 명
            searchEmpNum:"", //저장될 직원 번호
            selectedEmpNum:"", // 선택될 직원 번호 

            selectedReturnCode: "", // 선택한 반품 코드 
            searchReturnCode : "", // 저장될 반품 코드
            selectedReturnReason:"", // 선택될 반품 이유
            searchReturnReason : "", // 저장될 반품 이유 

            //반품시킬정보 
            productCode:"",
            outputNum:"",
            outputAmount:"",
            clientNum:"",
           

            


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
        this.selectedEmpName = emp.name;
        this.selectedEmpNum = emp.emp_num;
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
                this.searchEmpNum = this.selectedEmpNum;
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
            output_date: this.dateFormat(col.output_date, "yyyy-MM-dd"),
            com_name : row.data.com_name,
            })
        );
        console.log("rowDataOutputOrder:",this.rowDataOutputOrder);
    },
    onOutputReturn(row){
        let output = row.data;
        this.outputAmount = output.output_amount;
        this.productCode = output.product_code;
        this.outputNum = output.output_num;
        this.clientNum = output.client_num;
        console.log("출고할 값",output);
        
    },
    async returninstall(){
        if(this.outputAmount < this.returnNum){
            this.$notify({
                    text: `출고량보다 반품량이 많습니다.`,
                    type: 'error',
                });
            return;
        }

        let returnInfo ={
            client_num : this.clientNum,
            product_code : this.productCode,
            return_num : Number(this.returnNum),
            return_code : this.searchReturnCode,
            emp_num : this.searchEmpNum,
            output_num : this.outputNum
        }

        let result = 
                    await axios.post(`${ajaxUrl}/return/insert`,returnInfo)
                               .catch(err => console.log(err));
        console.log(result.data);
        if(result.statusText === 'OK'){
                    this.$notify({
                        text: `반품처리가 완료되었습니다.`,
                        type: 'success',
                    });  
                   
                }
    }
        

  

            

      

        
    
    },//method
    
};
</script>
<style lang="scss" scoped>
.main-container{
    background-color:  #e9ecef;
    border-radius: 10px;
    
}
.grid-container {
  margin-bottom: 20px;
}
.form-section {
  margin-bottom: 20px;
}
.button-container {
    display: flex; /* Flex 컨테이너 설정 */
    gap: 10px; /* 버튼 간 간격 */
    justify-content: flex-end; /* 오른쪽 정렬 */
    align-items: center; /* 세로 가운데 정렬 */
}

/* 버튼이 한 줄에 정렬되도록 조정 */
.row {
  display: flex;
  align-items: center; /* 수직 정렬 */
  margin-bottom: 20px;
}
.d-flex {
    display: flex;
    gap: 10px; /* 입력 필드와 버튼 사이 여백 */
}
.text-end {
  text-align: right; /* 오른쪽 정렬 */
  justify-content: flex-end; /* 버튼을 오른쪽 정렬 */
}
.button-group {
    display: flex; /* 버튼 그룹을 Flexbox로 설정 */
    gap: 10px; /* 버튼 간 간격 */
}

.material-button {
    display: flex; /* Flex 설정 */
    align-items: center; /* 텍스트와 아이콘 가운데 정렬 */
    justify-content: center; /* 텍스트 가운데 정렬 */
    padding: 8px 16px; /* 적절한 패딩 설정 */
    margin: 0; /* 기존 여백 제거 */
    cursor: pointer;
}
.col-sm-6 {
    display: flex;
    align-items: center; /* 세로 가운데 정렬 */
}

.select-container {
  background-color: #e9ecef;
  border-radius: 10px;
  width: 100%;
  max-width: 650px;
  min-height: 400px;
  margin-top: 70px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
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
