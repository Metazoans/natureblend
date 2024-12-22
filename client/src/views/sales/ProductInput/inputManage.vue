<template>
    <div class="container-fluid py-4">
    <!--검색 폼 -->
    <h2>제품입고등록</h2>
    <h4>완제품 품질 검사 조회</h4>
    <div class= "main-container">
        <div class= "pt-5 pb-5">
                <!--제품명 검색-->
                <div class="row align-items-center mb-3">
                    <label class="col-sm-2 col-form-label fw-bold" >제품명</label>
                    <div class="col-sm-4">
                        <input type="text" class="form-control" id="productName" v-model="productName" @click="openModal('product')" readonly>
                            <Modal
                                    :isShowModal="isShowModal.product"
                                    :modalTitle="'제품선택'"
                                    :noBtn="'닫기'"
                                    :yesBtn="'선택'"
                                    @closeModal="closeModal('product')"
                                    @confirm="confirm('product')"
                                >
                                <template v-slot:list>
                                    <proList v-show="isShowModal.product" @selectproduct="selectproduct" :indexNum="indexNum"/>
                                </template>
                            </Modal>
                    </div>    
                </div>
                <!--통과일자 검색 -->
                <div class="row align-items-center mb-5">
                    <label class="col-sm-2 col-form-label fw-bold">통과 일자</label>
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
                <material-button size="sm" color="warning" class="button" @click="searchQtResult">검색</material-button>
                <material-button size="sm" color="warning" class="button" @click="resetSearch">초기화</material-button>
            </div>
        </div>
    </div>



    <div class="container-fluid py-4">
        <div class="d-flex">
            <!-- 품질검사 조회(입고 안된 것들 )-->
            <div class="grid-container">
                <ag-grid-vue
                style ="width: 1100px; height: 500px;"
                :rowData="QtData"
                :columnDefs="columnQtlist"
                :theme="theme"
                @grid-ready="onGridReady"
                :noRowsOverlayComponent="noRowsOverlayComponent"
                @rowClicked="onQtRowClicked"
                :pagination="true"
                :paginationPageSize="10"
            />
            </div>
            <div style="display: none">
                <CustomNoRowsOverlay/>
            </div>
            <div class= "select-container">
                <div class="d-flex flex-column justify-content-center ps-5 pt-5" style="height: 200px;">
                        <!--담당자 선택 -->
                    <div class="row align-items-center mb-3">
                        <label class="col-sm-3 col-form-label fw-bold" >담당자</label>
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
                    <div class="row align-items-center mb-3">
                        <label class="col-sm-3 col-form-label fw-bold" >창고</label>
                        <div class="col-sm-9 d-flex">
                            <input 
                                id="EmpName"  class="form-control border p-2" 
                                v-model="warehouseName" @click="openModal('warehouse')" readonly/>
                                <Modal
                                    :isShowModal="isShowModal.warehouse"
                                    :modalTitle="'창고선택'"
                                    :noBtn="'닫기'"
                                    :yesBtn="'선택'"
                                    @closeModal="closeModal('warehouse')"
                                    @confirm="confirm('warehouse')"
                                >
                                <template v-slot:list>
                                    <WarList v-show="isShowModal.warehouse" @selectwarehouse="selectwarehouse"/>
                                </template>
                                </Modal>
                        </div> 
                    </div>
                   
                </div> 
                <!--검색 및 초기화-->
                <div class=" pt-5 text-center ">
                    <material-button  color="warning" class="button" @click="tempInputInfo">입력</material-button>
                    <material-button color="warning" class="button" @click="resetinput">초기화</material-button>
                </div>
            </div>
       </div>
       <!-- 입고 임시 저장 -->
       <div>
            <div class="grid-container">
            <ag-grid-vue
            :rowData="tempInput"
            :columnDefs="columntempInput"
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
        </div>
       
        
    </div>
        
    
</template>

<script>
import MaterialButton from "@/components/MaterialButton.vue";
import Modal from "@/views/natureBlendComponents/modal/Modal.vue";
import proList from "@/views/sales/Order/ProductModal.vue"
import EmpList from "@/views/sales/Order/EmpModal.vue";
import WarList from "@/views/sales/ProductInput/warehouseModal.vue";
import theme from "@/utils/agGridTheme";
import userDateUtils from '@/utils/useDates.js';
import CustomNoRowsOverlay from "@/views/natureBlendComponents/grid/noDataMsg.vue";
import axios from "axios";
import { ajaxUrl } from '@/utils/commons.js';

export default{
    name :"inputManage",
    components:{
            MaterialButton,
            Modal,
            proList,
            EmpList,
            WarList,
            CustomNoRowsOverlay,
            
    },
    data(){
        return{
            

            //검색 필터 데이터
            startDate:"", //통과날짜 시작 날짜
            endDate:"", //통과날짜 끝 날짜
            //제품 모달
            selectedProName:"",//선택될 제품 이름
            productName:'', //저장될 제품 이름 
            selectedProCode:"", //선택될 제품 코드 
            productCode:'', //저장될 제품 코드 

          

            // 품질검사 조회 결과 
            noRowsOverlayComponent: 'CustomNoRowsOverlay',
            filteredQtResult : [],
            theme : theme,
            QtData : [],
            columnQtlist : [
            { headerName : "포장검사코드", field:'qc_packing_id'},
            { headerName : "제품코드", field:'product_code'},
            { headerName : "제품명",field:'product_name'},
            { headerName : "작업번호",field:'process_num'},
            { headerName : "입고수량",field:'pass_qnt'},
            { headerName : "통과날짜",field:'inspec_end'},
             ],

           
            //출고 시킬 제품 선택 

             //직원  모달
            searchEmpName:"", // 저장될 직원 명 
            selectedEmpName:"", //선택될 직원 명 

            //창고모달   
            warehouseCode : "", // 저장될 창고번호
            selectedWarehouseCode:"", // 선택될 창고 번호
            warehouseName:"", // 저장될 창고이름
            selectedWarehouseName : "", // 선택될 창고 이름 


            //임시입고정보 보관 
            tempProductCode: '',
            tempProductName: '',
            inputAmount: 0,
            qtId: '',
            inputDate: '',
            

            tempInput :[],
            columntempInput :[
                { headerName: "체크",
                field: "check",
                resizable: false,
                editable: true,
                sortable: false,
                checkboxSelection: true,
                },
                { headerName: "포장검사코드 ", field: "qtId", resizable: true, sortable: true },
                { headerName: "제품 코드", field: "tempProductCode", resizable: true, sortable: true },
                { headerName: "제품 명", field: "tempProductName", resizable: true, sortable: true },
                { headerName: "입고수량", field: "inputAmount", resizable: true, sortable: true },
                { headerName: "창고 위치", field: "warehouseName", resizable: true, sortable: true },
                { headerName: "담당자", field: "employeeName", resizable: true, sortable: true },
                { headerName: "입고 날짜", field: "inputDate", resizable: true, sortable: true },
            ],


           

            


            isShowModal: {
            client: false, // 거래처 모달
            emp: false, // 직원 모달
            warehouse:false, //창고모달 
            },

            
           

            
        }
    },
   
 

    methods:{
        selectproduct(product){
            //console.log(product); 
            this.selectedProCode = product.product_code;
            this.selectedProName = product.product_name;
        },
        selectemp(emp){
            this.selectedEmpName = emp;
        },
        selectwarehouse(warehouse){
            this.selectedWarehouseCode = warehouse.warehouse_code;
            this.selectedWarehouseName = warehouse.warehouse_name;
        },
        openModal(modalType){
            this.isShowModal[modalType] = true; 
            console.log(`${modalType} modal open`);
        },
        
        confirm(modalType){
            if (modalType === 'product') {
                this.productName = this.selectedProName;
                this.productCode = this.selectedProCode;
            } else if (modalType === 'emp') {
                this.searchEmpName = this.selectedEmpName;
            } else if (modalType === 'warehouse'){
                this.warehouseCode = this.selectedWarehouseCode;
                this.warehouseName = this.selectedWarehouseName;
            }
            this.closeModal(modalType); // 모달 닫기
        },
        closeModal(modalType) {
            this.isShowModal[modalType] = false;
        },
        //주문서검색 초기화
        resetSearch(){
            this.productName = ""; // 공백 문자 대신 빈 문자열로 초기화
            this.productCode = "";
            this.startDate = "";  // 빈 문자열로 초기화
            this.endDate = "";    // 빈 문자열로 초기화
        },
        //통과 검사 결과 조회 (필터)
        async searchQtResult(){
            this.filters  = {
                productCode : this.productCode,
                startDate : this.startDate,
                endDate : this.endDate,
            }

            console.log(this.filters);

            let result = await axios.put(`${ajaxUrl}/input/qtsearch`,this.filters )
                                    .catch(err => console.log(err));
            console.log(result.data);
            this.QtData = result.data;
            this.QtData = result.data.map((col) => ({
                ...col,
                inspec_end: this.dateFormat(col.inspec_end, "yyyy-MM-dd"),
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

        // 검사 결과 클릭 
        onQtRowClicked(row) {
            let order = row.data;
            this.tempProductCode = order.product_code;
            this.tempProductName = order.product_name;
            this.inputAmount = order.pass_qnt;
            this.qtId = order.qc_packing_id;
            this.inputDate= order.inspec_end;

            console.log("클릭된데이터:",this.tempProductCode,this.tempProductName);
            console.log(this.warehouseName , this.searchEmpName.name);
            // 입고를 원하는 검사 결과 클릭한 정보 +  담당자,창고 선택 폼 등장 
            // => 여기서 입고 정보 다 가지고 있어야 함   
        },

        // 밑에 위에서 작성한 입고 정보 출력 해서 체크박스 선택 받아서 입고 등록 
        tempInputInfo(){
            //선택된 데이터 들 묶음
            let selectedData = {
                tempProductCode : this.tempProductCode,
                tempProductName : this.tempProductName,
                inputAmount : this.inputAmount,
                qtId : this.qtId,
                inputDate : this.inputDate,
                employeeName : this.searchEmpName.name,
                warehouseName : this.warehouseName,
            }
            //중복체크 
            let isDuplicate = this.tempInput.some(
                (item) => item.qtId === selectedData.qtId && item.tempProductCode === selectedData.tempProductCode
            );
            if(!isDuplicate){
                //tempInput 데이터 추가
                this.tempInput.push(selectedData);
                console.log("데이터추가:",selectedData);
            }else{
                this.$notify({
                    text: ' 중복된 품질검사 입니다.',
                    type: 'error',
                });
                return;
            } 
            console.log("현재 tempInput 상태:",this.tempInput);  
        },
        
        
        
        // resetinput(){
        //     // 체크박스 해제
        //     this.gridApi.deselectAll();
        //      // 입력 필드 초기화
            

        //     // 출력 수량 초기화
            
            
        // },

        
    },//method
    
};
</script>
<style lang="scss" scoped>
.main-container{
    background-color:  #e9ecef;
    border-radius: 10px;
    
}
.select-container{
    background-color:  #e9ecef;
    border-radius: 10px;
    width: 650px;
    height: 300px;
    margin-top: 70px;
}

.d-flex {
  display: flex;
  justify-content: space-between;
  gap: 10px;
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
